const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const PORTA = process.env.PORT || 3000
const ARQUIVO = path.join(__dirname, 'data', 'filmes.json')

function lerFilmes() {
  return JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'))
}

function salvarFilmes(lista) {
  fs.writeFileSync(ARQUIVO, `${JSON.stringify(lista, null, 2)}\n`)
}

function gerarId(lista) {
  return Math.max(0, ...lista.map((filme) => Number(filme.id))) + 1
}

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')))

app.get('/filmes', (req, res) => {
  const filmes = lerFilmes()
  const lista = req.query.status
    ? filmes.filter((filme) => filme.status === req.query.status)
    : filmes

  res.json(lista)
})

app.get('/filmes/:id', (req, res) => {
  const id = Number(req.params.id)
  const filme = lerFilmes().find((item) => item.id === id)

  if (!filme) {
    return res.status(404).json({ erro: 'Filme não encontrado' })
  }

  res.json(filme)
})

app.post('/filmes', (req, res) => {
  const dados = req.body
  if (
    !dados ||
    typeof dados !== 'object' ||
    Array.isArray(dados) ||
    typeof dados.titulo !== 'string' ||
    !dados.titulo.trim() ||
    dados.ano === undefined ||
    dados.ano === null ||
    dados.ano === ''
  ) {
    return res.status(400).json({ erro: 'Título e ano são obrigatórios' })
  }

  const lista = lerFilmes()
  const novo = { ...dados, id: gerarId(lista) }
  lista.push(novo)
  salvarFilmes(lista)

  res.status(201).json(novo)
})

app.put('/filmes/:id', (req, res) => {
  const id = Number(req.params.id)
  const lista = lerFilmes()
  const indice = lista.findIndex((filme) => filme.id === id)

  if (indice === -1) {
    return res.status(404).json({ erro: 'Filme não encontrado' })
  }

  lista[indice] = { ...lista[indice], ...req.body, id }
  salvarFilmes(lista)

  res.json(lista[indice])
})

app.delete('/filmes/:id', (req, res) => {
  const id = Number(req.params.id)
  const lista = lerFilmes()

  if (!lista.some((filme) => filme.id === id)) {
    return res.status(404).json({ erro: 'Filme não encontrado' })
  }

  salvarFilmes(lista.filter((filme) => filme.id !== id))
  res.sendStatus(204)
})

app.listen(PORTA, () => {
  console.log(`API CineTrack disponível em http://localhost:${PORTA}`)
})
