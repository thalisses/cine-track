import { useEffect, useState } from 'react'
import { listar } from './api.js'
import { gerarId } from './data/filmes.js'
import Filtros from './components/Filtros.jsx'
import Header from './components/Header.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import ModalFilme from './components/ModalFilme.jsx'

const anoAtual = new Date().getFullYear()

export default function App() {
  const [filmes, setFilmes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [status, setStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [filmeEditando, setFilmeEditando] = useState(null)

  useEffect(() => {
    let ativo = true

    listar()
      .then((dados) => {
        if (ativo) {
          setFilmes(dados)
        }
      })
      .catch((erroCarga) => {
        if (ativo) {
          setErro(
            erroCarga instanceof Error
              ? erroCarga.message
              : 'Ocorreu um erro inesperado.',
          )
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false)
        }
      })

    return () => {
      ativo = false
    }
  }, [])

  useEffect(() => {
    document.title = `CineTrack (${filmes.length})`
  }, [filmes.length])

  const termoBusca = busca.trim().toLocaleLowerCase('pt-BR')
  const visiveis = filmes.filter((filme) => {
    const correspondeStatus = status === 'todos' || filme.status === status
    const correspondeBusca = filme.titulo
      .toLocaleLowerCase('pt-BR')
      .includes(termoBusca)

    return correspondeStatus && correspondeBusca
  })
  let conteudo

  if (carregando) {
    conteudo = <p>Carregando filmes...</p>
  } else if (erro) {
    conteudo = <p className="erro">Erro ao carregar filmes: {erro}</p>
  } else {
    conteudo = (
      <ListaFilmes
        filmes={visiveis}
        aoEditar={abrirEdicao}
        aoRemover={removerFilme}
      />
    )
  }

  function abrirCadastro() {
    setFilmeEditando(null)
    setModalAberto(true)
  }

  function abrirEdicao(filme) {
    setFilmeEditando(filme)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setFilmeEditando(null)
  }

  function salvarFilme(dados) {
    if (filmeEditando) {
      setFilmes((anteriores) =>
        anteriores.map((filme) =>
          filme.id === filmeEditando.id ? { ...filme, ...dados } : filme,
        ),
      )
    } else {
      setFilmes((anteriores) => [
        ...anteriores,
        { id: gerarId(anteriores), ...dados },
      ])
    }

    fecharModal()
  }

  function removerFilme(filme) {
    const confirmado = window.confirm(
      `Deseja remover o filme "${filme.titulo}"?`,
    )

    if (confirmado) {
      setFilmes((anteriores) =>
        anteriores.filter((item) => item.id !== filme.id),
      )
    }
  }

  return (
    <div className="pagina">
      <Header busca={busca} aoBuscar={setBusca} aoAdicionar={abrirCadastro} />
      <Filtros ativo={status} aoMudar={setStatus} />
      <main>{conteudo}</main>
      <footer className="rodape">
        <small>CineTrack © {anoAtual}</small>
      </footer>
      {modalAberto && (
        <ModalFilme
          filme={filmeEditando}
          aoSalvar={salvarFilme}
          aoFechar={fecharModal}
        />
      )}
    </div>
  )
}
