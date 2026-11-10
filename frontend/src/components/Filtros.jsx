export default function Filtros() {
  return (
    <nav aria-label="Filtros de status">
      <button className="ativo" type="button">
        Todos
      </button>
      <button type="button">Assistido</button>
      <button type="button">Assistindo</button>
      <button type="button">Quero assistir</button>
    </nav>
  )
}
