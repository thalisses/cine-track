const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const morgan = require('morgan')

const app = express()
const PORTA = Number(process.env.PORT) || 3000
const ARQUIVO = path.join(__dirname, 'data', 'filmes.json')

function lerFilmes() {
  return JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'))
}

app.use(morgan('dev'))
app.use(express.json())

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

app.listen(PORTA, () => {
  console.log(`API CineTrack disponível em http://localhost:${PORTA}`)
})
