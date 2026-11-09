# cine-track

Projeto da matéria de Sistemas Web do curso de Engenharia de Software da UEM.

O CineTrack é um catálogo de filmes feito com HTML, CSS e JavaScript. A Parte 1
oferece listagem, busca em tempo real, filtros por status e operações de
cadastro, edição e remoção. Os filmes ficam persistidos no `localStorage` do
navegador.

## Executar a Parte 1

Na raiz do projeto, inicie o servidor local:

```sh
npx live-server .
```

Abra `http://127.0.0.1:8080/parte1/` no navegador. Se a porta 8080 estiver
ocupada, o `live-server` exibirá a porta alternativa no terminal.

## Estrutura

- `parte1/`: frontend interativo do catálogo.
- `assets/`: pôsteres dos filmes de exemplo.
- `docs/requisitos.md`: campos do filme e contrato futuro da API.

A Parte 2 evoluirá o projeto para uma aplicação full stack.