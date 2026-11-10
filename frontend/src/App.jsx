import { filmesIniciais } from './data/filmes.js'
import Filtros from './components/Filtros.jsx'
import Header from './components/Header.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'

const anoAtual = new Date().getFullYear()

export default function App() {
  return (
    <>
      <Header />
      <Filtros />
      <main>
        <ListaFilmes filmes={filmesIniciais} />
      </main>
      <footer className="rodape">
        <small>CineTrack © {anoAtual}</small>
      </footer>
    </>
  )
}
