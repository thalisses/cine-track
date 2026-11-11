export default function Header({ busca, aoBuscar }) {
  return (
    <header>
      <h1>CineTrack</h1>
      <input
        type="search"
        aria-label="Buscar filme"
        placeholder="Buscar filme..."
        value={busca}
        onChange={(evento) => aoBuscar(evento.target.value)}
      />
      <button type="button" aria-label="Adicionar filme">
        <span className="texto-curto">+</span>
        <span className="texto-completo">+ Adicionar</span>
      </button>
    </header>
  )
}
