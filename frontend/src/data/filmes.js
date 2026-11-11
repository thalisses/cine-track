import aOrigem from '../../../assets/a-origem.jpg'
import cidadeDeDeus from '../../../assets/cidade-de-deus.jpg'
import dunaParteDois from '../../../assets/duna-parte-dois.jpg'
import interestelar from '../../../assets/interestelar.jpg'
import oAutoDaCompadecida from '../../../assets/o-alto-da-compadecida.jpg'
import parasita from '../../../assets/parasita.jpg'

export const filmesIniciais = [
  {
    id: '1',
    titulo: 'A Origem',
    ano: 2010,
    genero: 'Ficção científica',
    poster: aOrigem,
    status: 'assistido',
    nota: 5,
    comentario: '',
  },
  {
    id: '2',
    titulo: 'Parasita',
    ano: 2019,
    genero: 'Suspense',
    poster: parasita,
    status: 'assistido',
    nota: 4,
    comentario: '',
  },
  {
    id: '3',
    titulo: 'O Auto da Compadecida',
    ano: 2000,
    genero: 'Comédia',
    poster: oAutoDaCompadecida,
    status: 'assistido',
    nota: 4,
    comentario: '',
  },
  {
    id: '4',
    titulo: 'Duna: Parte Dois',
    ano: 2024,
    genero: 'Ficção científica',
    poster: dunaParteDois,
    status: 'assistindo',
    nota: 4,
    comentario: '',
  },
  {
    id: '5',
    titulo: 'Interestelar',
    ano: 2014,
    genero: 'Ficção científica',
    poster: interestelar,
    status: 'quero assistir',
    nota: 4,
    comentario: '',
  },
  {
    id: '6',
    titulo: 'Cidade de Deus',
    ano: 2002,
    genero: 'Crime',
    poster: cidadeDeDeus,
    status: 'quero assistir',
    nota: 4,
    comentario: '',
  },
]

export function gerarId(filmes) {
  const ids = filmes.map((filme) => Number(filme.id)).filter(Number.isInteger)
  return String(Math.max(0, ...ids) + 1)
}
