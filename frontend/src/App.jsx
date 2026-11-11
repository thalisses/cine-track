import { useState } from 'react'
import { filmesIniciais } from './data/filmes.js'
import Filtros from './components/Filtros.jsx'
import Header from './components/Header.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'

const anoAtual = new Date().getFullYear()

export default function App() {
  const [status, setStatus] = useState('todos')
  const [busca, setBusca] = useState('')

  const termoBusca = busca.trim().toLocaleLowerCase('pt-BR')
  const visiveis = filmesIniciais.filter((filme) => {
    const correspondeStatus = status === 'todos' || filme.status === status
    const correspondeBusca = filme.titulo
      .toLocaleLowerCase('pt-BR')
      .includes(termoBusca)

    return correspondeStatus && correspondeBusca
  })

  return (
    <>
      <Header busca={busca} aoBuscar={setBusca} />
      <Filtros ativo={status} aoMudar={setStatus} />
      <main>
        <ListaFilmes filmes={visiveis} />
      </main>
      <footer className="rodape">
        <small>CineTrack © {anoAtual}</small>
      </footer>
    </>
  )
}
