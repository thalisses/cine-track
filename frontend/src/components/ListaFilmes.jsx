import CardFilme from './CardFilme.jsx'

export default function ListaFilmes({ filmes }) {
  if (filmes.length === 0) {
    return (
      <section id="lista" aria-label="Lista de filmes">
        <p>Nenhum filme encontrado.</p>
      </section>
    )
  }

  return (
    <section id="lista" aria-label="Lista de filmes">
      {filmes.map((filme) => (
        <CardFilme key={filme.id} filme={filme} />
      ))}
    </section>
  )
}
