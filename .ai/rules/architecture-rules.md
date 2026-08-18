# Architecture Rules

## Monorepo

Aplicações:

apps/

Bibliotecas:

packages/

## Dependências

Permitido:

apps → packages

Não permitido:

packages → apps

## Domínios

Cada domínio deve ser isolado.

Exemplo:

exercises

plans

users

Um domínio não deve acessar internamente outro domínio.
