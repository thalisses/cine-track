const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

async function pedir(caminho, opcoes = {}) {
  let resposta
  try {
    resposta = await fetch(`${BASE}${caminho}`, opcoes)
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro
    throw new Error('Não foi possível conectar à API.')
  }

  if (!resposta.ok) {
    const tipo = resposta.headers.get('content-type') || ''
    if (tipo.includes('application/json')) {
      const dados = await resposta.json()
      if (typeof dados.erro === 'string' && dados.erro) {
        throw new Error(dados.erro)
      }
    }
    throw new Error(`A API respondeu com erro HTTP ${resposta.status}.`)
  }

  return resposta.status === 204 ? null : resposta.json()
}

export function listar(opcoes = {}) {
  return pedir('/filmes', opcoes)
}

export function criar(filme) {
  return pedir('/filmes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filme),
  })
}

export function atualizar(id, filme) {
  return pedir(`/filmes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filme),
  })
}

export function remover(id) {
  return pedir(`/filmes/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function urlPoster(poster) {
  return poster.startsWith('/assets/') ? `${BASE}${poster}` : poster
}
