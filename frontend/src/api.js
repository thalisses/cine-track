import { filmesIniciais } from './data/filmes.js'

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms))
}

export async function listar() {
  await esperar(500)
  return filmesIniciais.map((filme) => ({ ...filme }))
}
