import { useEffect, useRef, useState } from 'react'

const STATUS_VALIDOS = ['assistido', 'assistindo', 'quero assistir']

function criarDadosIniciais(filme) {
  return {
    titulo: filme?.titulo ?? '',
    ano: filme ? String(filme.ano) : '',
    genero: filme?.genero ?? '',
    poster: filme?.poster ?? '',
    status: filme?.status ?? 'quero assistir',
    nota: filme ? String(filme.nota) : '',
    comentario: filme?.comentario ?? '',
  }
}

function validarFilme(dados) {
  const erros = []
  const ano = Number(dados.ano)
  const nota = Number(dados.nota)

  if (!dados.titulo.trim()) {
    erros.push('Informe o título do filme.')
  }
  if (!Number.isInteger(ano) || ano < 1888 || ano > 2030) {
    erros.push('O ano deve ser um número entre 1888 e 2030.')
  }
  if (!dados.genero.trim()) {
    erros.push('Informe o gênero do filme.')
  }
  if (dados.poster.trim()) {
    try {
      const url = new URL(dados.poster, window.location.origin)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        erros.push('O pôster deve usar uma URL HTTP ou HTTPS.')
      }
    } catch {
      erros.push('Informe uma URL válida para o pôster.')
    }
  }
  if (!STATUS_VALIDOS.includes(dados.status)) {
    erros.push('Selecione um status válido.')
  }
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    erros.push('A nota deve ser um número inteiro entre 1 e 5.')
  }

  return erros
}

export default function ModalFilme({
  filme,
  aoSalvar,
  aoFechar,
  salvando,
  erroSalvar,
}) {
  const [dados, setDados] = useState(() => criarDadosIniciais(filme))
  const [erros, setErros] = useState([])
  const tituloRef = useRef(null)

  useEffect(() => {
    tituloRef.current?.focus()
  }, [])

  useEffect(() => {
    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        aoFechar()
      }
    }

    document.addEventListener('keydown', aoPressionarTecla)
    return () => document.removeEventListener('keydown', aoPressionarTecla)
  }, [aoFechar, salvando])

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setDados((anteriores) => ({ ...anteriores, [name]: value }))
    setErros([])
  }

  function enviarFormulario(evento) {
    evento.preventDefault()
    if (salvando) return
    const errosValidacao = validarFilme(dados)
    setErros(errosValidacao)

    if (errosValidacao.length > 0) {
      return
    }

    aoSalvar({
      titulo: dados.titulo.trim(),
      ano: Number(dados.ano),
      genero: dados.genero.trim(),
      poster: dados.poster.trim(),
      status: dados.status,
      nota: Number(dados.nota),
      comentario: dados.comentario.trim(),
    })
  }

  return (
    <div id="modal">
      <section
        className="modal-conteudo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-pagina"
      >
        <h1 id="titulo-pagina">{filme ? 'Editar filme' : 'Adicionar filme'}</h1>
        <form id="form-filme" noValidate onSubmit={enviarFormulario}>
          <label htmlFor="titulo">Título:</label>
          <input
            ref={tituloRef}
            id="titulo"
            name="titulo"
            type="text"
            value={dados.titulo}
            onChange={atualizarCampo}
            required
          />

          <label htmlFor="ano">Ano (1888 a 2030):</label>
          <input
            id="ano"
            name="ano"
            type="number"
            min="1888"
            max="2030"
            step="1"
            value={dados.ano}
            onChange={atualizarCampo}
            required
          />

          <label htmlFor="genero">Gênero:</label>
          <input
            id="genero"
            name="genero"
            type="text"
            value={dados.genero}
            onChange={atualizarCampo}
            required
          />

          <label htmlFor="poster">URL do pôster:</label>
          <input
            id="poster"
            name="poster"
            type="url"
            value={dados.poster}
            onChange={atualizarCampo}
          />

          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={dados.status}
            onChange={atualizarCampo}
            required
          >
            <option value="assistido">Assistido</option>
            <option value="assistindo">Assistindo</option>
            <option value="quero assistir">Quero assistir</option>
          </select>

          <label htmlFor="nota">Nota (1 a 5):</label>
          <input
            id="nota"
            name="nota"
            type="number"
            min="1"
            max="5"
            step="1"
            value={dados.nota}
            onChange={atualizarCampo}
            required
          />

          <label htmlFor="comentario">Comentário:</label>
          <textarea
            id="comentario"
            name="comentario"
            value={dados.comentario}
            onChange={atualizarCampo}
          />

          {erros.length > 0 && (
            <ul id="erros-form" role="alert" aria-live="assertive">
              {erros.map((erro) => (
                <li key={erro}>{erro}</li>
              ))}
            </ul>
          )}

          {erroSalvar && (
            <p className="erro" role="alert">
              Erro ao salvar filme: {erroSalvar}
            </p>
          )}

          <div className="form-acoes">
            <button type="button" disabled={salvando} onClick={aoFechar}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
