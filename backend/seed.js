const fs = require('node:fs')
const path = require('node:path')

const ARQUIVO = path.join(__dirname, 'data', 'filmes.json')

const filmes = [
  {
    id: 1,
    titulo: 'A Origem',
    ano: 2010,
    genero: 'Ficção científica',
    nota: 5,
    status: 'assistido',
    comentario: '',
    poster: '/assets/a-origem.jpg',
  },
  {
    id: 2,
    titulo: 'Parasita',
    ano: 2019,
    genero: 'Suspense',
    nota: 4,
    status: 'assistido',
    comentario: '',
    poster: '/assets/parasita.jpg',
  },
  {
    id: 3,
    titulo: 'O Auto da Compadecida',
    ano: 2000,
    genero: 'Comédia',
    nota: 4,
    status: 'assistido',
    comentario: '',
    poster: '/assets/o-alto-da-compadecida.jpg',
  },
  {
    id: 4,
    titulo: 'Duna: Parte Dois',
    ano: 2024,
    genero: 'Ficção científica',
    nota: 4,
    status: 'assistindo',
    comentario: '',
    poster: '/assets/duna-parte-dois.jpg',
  },
  {
    id: 5,
    titulo: 'Interestelar',
    ano: 2014,
    genero: 'Ficção científica',
    nota: 4,
    status: 'quero assistir',
    comentario: '',
    poster: '/assets/interestelar.jpg',
  },
  {
    id: 6,
    titulo: 'Cidade de Deus',
    ano: 2002,
    genero: 'Crime',
    nota: 4,
    status: 'quero assistir',
    comentario: '',
    poster: '/assets/cidade-de-deus.jpg',
  },
]

fs.mkdirSync(path.dirname(ARQUIVO), { recursive: true })
fs.writeFileSync(ARQUIVO, `${JSON.stringify(filmes, null, 2)}\n`)

console.log(`${filmes.length} filmes gravados em ${ARQUIVO}`)
