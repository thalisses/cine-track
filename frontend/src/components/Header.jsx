export default function Header() {
  return (
    <header>
      <h1>CineTrack</h1>
      <input
        type="search"
        aria-label="Buscar filme"
        placeholder="Buscar filme..."
      />
      <button type="button" aria-label="Adicionar filme">
        <span className="texto-curto">+</span>
        <span className="texto-completo">+ Adicionar</span>
      </button>
    </header>
  )
}
