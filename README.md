# Projeto: Sabor em Minutos

Este é um app simples que busca receitas na API pública TheMealDB e exibe os detalhes em um modal.

## Como rodar

1) Abra o arquivo `recipe_app.html` no navegador.
2) Use o campo de busca ou clique em "Me Surpreenda!".

Observação: algumas funcionalidades requerem internet (API TheMealDB e CDN do Bootstrap/FontAwesome).

## Teste rápido (offline, com mocks)

Incluímos um smoke test que não depende da internet:

- Abra `test/smoke-test.html` no navegador. Ele:
  - Mocka o `fetch` da API para retornar dados estáticos.
  - Mocka `bootstrap.Modal` o suficiente para o script funcionar.
  - Verifica se os cards são renderizados, se o modal abre e se a busca funciona.

Se tudo estiver correto, você verá mensagens "OK" na página.

## Estrutura principal

- `recipe_app.html`: HTML principal e includes de CSS/JS.
- `recipe_script.js`: Lógica de busca, renderização e modal.
- `recipe_style.css`: Estilos customizados (opcional).
- `test/smoke-test.html`: Teste simples com mocks.

## Dicas

- Se o vídeo do YouTube não aparecer, verifique se a receita possui `strYoutube` e se o navegador permite embeds.
- Mensagens de erro aparecerão na área de feedback abaixo dos resultados.
