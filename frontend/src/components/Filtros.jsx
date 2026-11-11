const opcoes = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'assistido', rotulo: 'Assistido' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'quero assistir', rotulo: 'Quero assistir' },
]

export default function Filtros({ ativo, aoMudar }) {
  return (
    <nav aria-label="Filtros de status">
      {opcoes.map((opcao) => (
        <button
          key={opcao.valor}
          className={ativo === opcao.valor ? 'ativo' : ''}
          type="button"
          aria-pressed={ativo === opcao.valor}
          onClick={() => aoMudar(opcao.valor)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </nav>
  )
}
