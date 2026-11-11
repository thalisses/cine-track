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

## Parte 2 — Usando Vite

O frontend React está em `frontend/`. A listagem inicial usa um mock assíncrono
em `src/api.js`; as alterações de cadastro, edição e remoção ficam em memória.
Para executá-lo:

```sh
cd frontend
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (por padrão, `http://localhost:5173`).
Use `npm run lint` para verificar o código com Biome e `npm run format` para
formatá-lo.

## Backend — Aula 1 de Node

Para gerar o arquivo JSON inicial:

```sh
cd backend
npm install
npm run seed
```

O comando grava os seis filmes em `backend/data/filmes.json`. Os scripts
`npm start` e `npm run dev` serão usados quando o servidor for criado na
próxima aula.

## Estrutura

- `parte1/`: frontend interativo do catálogo.
- `frontend/`: frontend React iniciado com Vite.
- `backend/`: seed JSON e dependências do futuro servidor Node.
- `assets/`: pôsteres dos filmes de exemplo.
- `docs/requisitos.md`: campos do filme e contrato futuro da API.

A Parte 2 evoluirá o projeto para uma aplicação full stack.