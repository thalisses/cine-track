const ROTULOS_STATUS = {
  assistido: 'Assistido',
  assistindo: 'Assistindo',
  'quero assistir': 'Quero assistir',
}

const CLASSES_STATUS = {
  assistido: 'assistido',
  assistindo: 'assistindo',
  'quero assistir': 'quero',
}

function estrelas(nota) {
  return '★'.repeat(nota) + '☆'.repeat(5 - nota)
}

export default function CardFilme({ filme }) {
  return (
    <article className="card">
      <img src={filme.poster} alt={`Cartaz do filme ${filme.titulo}`} />
      <h2>{filme.titulo}</h2>
      <p>
        {filme.ano} • {filme.genero}
      </p>
      <p>
        Nota:{' '}
        <span role="img" aria-label={`Nota: ${filme.nota} de 5`}>
          {estrelas(filme.nota)}
        </span>
      </p>
      <p className={`status ${CLASSES_STATUS[filme.status]}`}>
        {ROTULOS_STATUS[filme.status]}
      </p>
      {filme.comentario && <p>{filme.comentario}</p>}
    </article>
  )
}
