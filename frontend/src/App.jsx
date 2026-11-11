import { useEffect, useRef, useState } from 'react'
import { atualizar, criar, listar, remover } from './api.js'
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
  const [salvando, setSalvando] = useState(false)
  const [erroSalvar, setErroSalvar] = useState(null)
  const [removendo, setRemovendo] = useState(false)
  const [erroRemover, setErroRemover] = useState(null)
  const operacaoPendente = useRef(false)

  useEffect(() => {
    let ativo = true
    const controlador = new AbortController()

    listar({ signal: controlador.signal })
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
      controlador.abort()
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
        desabilitado={removendo}
      />
    )
  }

  function abrirCadastro() {
    setFilmeEditando(null)
    setErroSalvar(null)
    setModalAberto(true)
  }

  function abrirEdicao(filme) {
    setFilmeEditando(filme)
    setErroSalvar(null)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setFilmeEditando(null)
  }

  async function salvarFilme(dados) {
    if (operacaoPendente.current) return
    operacaoPendente.current = true
    setSalvando(true)
    setErroSalvar(null)
    try {
      if (filmeEditando) {
        const atualizado = await atualizar(filmeEditando.id, dados)
        setFilmes((anteriores) =>
          anteriores.map((filme) =>
            filme.id === atualizado.id ? atualizado : filme,
          ),
        )
      } else {
        const novo = await criar(dados)
        setFilmes((anteriores) => [...anteriores, novo])
      }
      fecharModal()
    } catch (erroOperacao) {
      setErroSalvar(
        erroOperacao instanceof Error
          ? erroOperacao.message
          : 'Erro inesperado.',
      )
    } finally {
      operacaoPendente.current = false
      setSalvando(false)
    }
  }

  async function removerFilme(filme) {
    if (operacaoPendente.current) return
    const confirmado = window.confirm(
      `Deseja remover o filme "${filme.titulo}"?`,
    )

    if (!confirmado) return
    operacaoPendente.current = true
    setRemovendo(true)
    setErroRemover(null)
    try {
      await remover(filme.id)
      setFilmes((anteriores) =>
        anteriores.filter((item) => item.id !== filme.id),
      )
    } catch (erroOperacao) {
      setErroRemover(
        erroOperacao instanceof Error
          ? erroOperacao.message
          : 'Erro inesperado.',
      )
    } finally {
      operacaoPendente.current = false
      setRemovendo(false)
    }
  }

  return (
    <div className="pagina">
      <Header
        busca={busca}
        aoBuscar={setBusca}
        aoAdicionar={abrirCadastro}
        desabilitado={carregando || !!erro || removendo}
      />
      <Filtros ativo={status} aoMudar={setStatus} />
      <main>
        {erroRemover && (
          <p className="erro" role="alert">
            Erro ao remover filme: {erroRemover}
          </p>
        )}
        {conteudo}
      </main>
      <footer className="rodape">
        <small>CineTrack © {anoAtual}</small>
      </footer>
      {modalAberto && (
        <ModalFilme
          filme={filmeEditando}
          aoSalvar={salvarFilme}
          aoFechar={fecharModal}
          salvando={salvando}
          erroSalvar={erroSalvar}
        />
      )}
    </div>
  )
}
