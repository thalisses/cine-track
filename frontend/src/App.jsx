import Titulo from './components/Titulo.jsx'

const anoAtual = new Date().getFullYear()

export default function App() {
  return (
    <main className="pagina">
      <Titulo />
      <footer className="rodape">
        <p>CineTrack © {anoAtual}</p>
      </footer>
    </main>
  )
}
