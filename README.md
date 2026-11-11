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

## Parte 2 — Como rodar o backend

Em um terminal, instale as dependências e configure a porta:

```sh
cd backend
npm install
cp .env.example .env
npm run dev
```

Por padrão, a API fica em `http://localhost:3000`. Altere `PORT` no `.env` se
a porta estiver ocupada. `npm start` inicia o servidor sem recarga automática.
O arquivo `backend/data/filmes.json` já contém os seis filmes iniciais.
Para restaurá-los, execute `npm run seed` no backend. **Esse comando substitui
todos os dados existentes.**

A API oferece:

- `GET /filmes` (com filtro opcional `?status=`)
- `GET /filmes/:id`
- `POST /filmes`
- `PUT /filmes/:id`
- `DELETE /filmes/:id`

## Parte 2 — Como rodar o frontend

Com o backend em execução, abra outro terminal:

```sh
cd frontend
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (por padrão, `http://localhost:5173`). O
frontend usa `http://localhost:3000` para acessar a API. Se o backend estiver
em outro endereço, copie `frontend/.env.example` para `frontend/.env.local`,
ajuste `VITE_API_URL` e reinicie o Vite. A mesma variável deve ser configurada
antes de `npm run build` para alterar o endereço no build de produção.

Use `npm run lint` para verificar o código com Biome, `npm run format` para
formatá-lo e `npm run build` para gerar a versão de produção.

## Estrutura

- `parte1/`: frontend interativo do catálogo.
- `frontend/`: frontend React iniciado com Vite.
- `backend/`: API Node/Express e persistência em arquivo JSON.
- `assets/`: pôsteres dos filmes de exemplo.
- `docs/requisitos.md`: campos do filme e contrato futuro da API.

O frontend e o backend da Parte 2 trabalham juntos como aplicação full stack.