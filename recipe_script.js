// recipe_script.js
// Script principal do app de receitas: busca na API, renderiza cards e abre modal com detalhes.

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const randomRecipeBtn = document.getElementById('random-recipe-btn');
    const resultsArea = document.getElementById('results-area');
    const resultsHeading = document.getElementById('results-heading');
    const feedbackArea = document.getElementById('feedback-area');
    const recipeModalEl = document.getElementById('recipeModal');
    const recipeModal = new bootstrap.Modal(recipeModalEl);

    const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

    // Chamada utilitária para a API com feedback de carregamento e tratamento de erro.
    async function fetchAPI(endpoint) {
        showFeedback('Carregando...', false);
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`Erro de rede (${response.status})`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            showFeedback(`Erro: ${error.message}`, true);
            return null;
        }
    }

    // Busca receitas pelo termo informado.
    async function searchRecipes(query) {
        resultsArea.innerHTML = '';
        resultsHeading.textContent = `Resultados para "${query}"`;
        const data = await fetchAPI(`search.php?s=${query}`);

        if (data && data.meals) {
            displayRecipes(data.meals);
            showFeedback('', false);
        } else {
            showFeedback('Nenhuma receita encontrada. Tente outra busca.', false);
        }
    }

    // Pega uma receita aleatória para surpreender o usuário.
    async function getRandomRecipe() {
        resultsArea.innerHTML = '';
        resultsHeading.textContent = 'Receita Surpresa!';
        const data = await fetchAPI('random.php');
        if (data && data.meals) {
            displayRecipes(data.meals);
            showFeedback('', false);
        } else {
            showFeedback('Não foi possível carregar a receita surpresa.', true);
        }
    }
            
    // Renderiza a grade de cards de receitas.
    function displayRecipes(meals) {
        resultsArea.innerHTML = '';
        meals.forEach(meal => {
            const card = document.createElement('div');
            card.className = 'col-md-4 col-lg-3 mb-4';
            card.innerHTML = `
                <div class="card recipe-card h-100" data-meal-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                    </div>
                </div>
            `;
            card.querySelector('.recipe-card').addEventListener('click', () => {
                showRecipeDetails(meal.idMeal);
            });
            resultsArea.appendChild(card);
        });
    }

    // Busca detalhes da receita e popula o conteúdo do modal.
    async function showRecipeDetails(mealId) {
        const data = await fetchAPI(`lookup.php?i=${mealId}`);
        if (data && data.meals) {
            const meal = data.meals[0];
            const modalTitle = recipeModalEl.querySelector('.modal-title');
            const modalBody = recipeModalEl.querySelector('.modal-body');

            modalTitle.textContent = meal.strMeal;
                    
            // Monta a lista de ingredientes/medidas (máx. 20 campos fornecidos pela API)
            let ingredientsHTML = '<h4>Ingredientes:</h4><ul>';
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== '') {
                    ingredientsHTML += `<li>${measure ? measure : ''} ${ingredient}</li>`;
                }
            }
            ingredientsHTML += '</ul>';
                    
            const instructionsHTML = `
                <h4>Instruções:</h4>
                <p style="white-space: pre-wrap;">${meal.strInstructions || ''}</p>
            `;

            // Vídeo do YouTube (se disponível). Usa extração robusta do ID.
            const youtubeHTML = meal.strYoutube ? `
                <div class="mt-4">
                    <h4>Vídeo</h4>
                    <div class="ratio ratio-16x9">
                        <iframe src="https://www.youtube.com/embed/${extractYouTubeId(meal.strYoutube)}" title="YouTube video player" allowfullscreen></iframe>
                    </div>
                </div>
            ` : '';

            // Insere conteúdo no corpo do modal e exibe
            modalBody.innerHTML = `${ingredientsHTML}${instructionsHTML}${youtubeHTML}`;
            recipeModal.show();
        }
    }

    // Exibe mensagens de feedback (carregando/erro/vazio)
    function showFeedback(message, isError) {
        const p = feedbackArea.querySelector('p');
        p.textContent = message;
        p.className = isError ? 'lead text-danger' : 'lead text-muted';
        feedbackArea.style.display = message ? 'block' : 'none';
    }

    // Trata o submit da busca
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            searchRecipes(query);
        }
    });

    // Botão "Me Surpreenda!"
    randomRecipeBtn.addEventListener('click', getRandomRecipe);

    // Busca inicial para preencher a tela
    getRandomRecipe();

    // Utilitário: extrai o ID do YouTube de uma URL completa; fallback para últimos 11 chars
    function extractYouTubeId(url) {
        try {
            const u = new URL(url);
            const v = u.searchParams.get('v');
            return v || url.slice(-11);
        } catch (_) {
            return url.slice(-11);
        }
    }
});