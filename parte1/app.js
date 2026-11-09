const CHAVE_FILMES = "cinetrack-filmes";
const filmesIniciais = [
	{ titulo: "A Origem", ano: 2010, genero: "Ficção científica", poster: "../assets/a-origem.jpg", status: "assistido", nota: 5, comentario: "" },
	{ titulo: "Parasita", ano: 2019, genero: "Suspense", poster: "../assets/parasita.jpg", status: "assistido", nota: 4, comentario: "" },
	{ titulo: "O Auto da Compadecida", ano: 2000, genero: "Comédia", poster: "../assets/o-alto-da-compadecida.jpg", status: "assistido", nota: 4, comentario: "" },
	{ titulo: "Duna: Parte Dois", ano: 2024, genero: "Ficção científica", poster: "../assets/duna-parte-dois.jpg", status: "assistindo", nota: 4, comentario: "" },
	{ titulo: "Interestelar", ano: 2014, genero: "Ficção científica", poster: "../assets/interestelar.jpg", status: "quero assistir", nota: 4, comentario: "" },
	{ titulo: "Cidade de Deus", ano: 2002, genero: "Crime", poster: "../assets/cidade-de-deus.jpg", status: "quero assistir", nota: 4, comentario: "" },
].map((filme, indice) => ({ id: String(indice + 1), ...filme }));
const TOTAL = filmesIniciais.length;
let filmes = [...filmesIniciais];

function carregarFilmes() {
	const dados = localStorage.getItem(CHAVE_FILMES);
	if (!dados) {
		localStorage.setItem(CHAVE_FILMES, JSON.stringify(filmesIniciais));
		return [...filmesIniciais];
	}

	try {
		const filmes = JSON.parse(dados);
		return Array.isArray(filmes) ? filmes : [...filmesIniciais];
	} catch {
		return [...filmesIniciais];
	}
}

function salvarFilmes(filmes) {
	localStorage.setItem(CHAVE_FILMES, JSON.stringify(filmes));
}

function rotuloStatus(status) {
	if (status === "assistido") return "assistido";
	if (status === "assistindo") return "assistindo";
	if (status === "quero assistir") return "quero";
	return status;
}

const estrelas = (nota) => {
	let resultado = "";
	for (let indice = 1; indice <= 5; indice++) {
		resultado += indice <= nota ? "★" : "☆";
	}
	return resultado;
};

function escaparHTML(valor) {
	return String(valor).replace(/[&<>"']/g, (caractere) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	})[caractere]);
}

function atualizarRodape(total = TOTAL) {
	const rodape = document.querySelector("#total-filmes");
	if (rodape) rodape.textContent = `CineTrack © 2026 · ${total} filmes cadastrados.`;
}

function renderizarCards(lista) {
	const secao = document.querySelector("#lista");
	if (!secao) return;

	secao.innerHTML = lista.map((filme) => {
		const classeStatus = {
			assistido: "assistido",
			assistindo: "assistindo",
			"quero assistir": "quero",
		}[filme.status] ?? "";
		const poster = filme.poster
			? `<img src="${escaparHTML(filme.poster)}" alt="Cartaz do filme ${escaparHTML(filme.titulo)}" />`
			: "";
		const comentario = filme.comentario
			? `<p>${escaparHTML(filme.comentario)}</p>`
			: "";
		const id = escaparHTML(filme.id);

		return `<article class="card" data-id="${id}">
			${poster}
			<h2>${escaparHTML(filme.titulo)}</h2>
			<p>${escaparHTML(filme.ano)} &bull; ${escaparHTML(filme.genero)}</p>
			<p>Nota: ${estrelas(Number(filme.nota))}</p>
			<p class="status ${classeStatus}">${escaparHTML(rotuloStatus(filme.status))}</p>
			${comentario}
			<span class="acoes">
				<button type="button" class="btn-editar" data-id="${id}">Editar</button>
				<button type="button" class="btn-remover" data-id="${id}">Remover</button>
			</span>
		</article>`;
	}).join("") || "<p>Nenhum filme encontrado.</p>";
}

function renderizarFilmes() {
	const secao = document.querySelector("#lista");
	if (!secao) return;

	const busca = document.querySelector("#busca").value.trim().toLocaleLowerCase("pt-BR");
	const filtro = document.querySelector("nav .ativo").dataset.status;
	const filmesFiltrados = filmes.filter((filme) => {
		const correspondeBusca = filme.titulo.toLocaleLowerCase("pt-BR").includes(busca);
		return correspondeBusca && (filtro === "todos" || filme.status === filtro);
	});

	renderizarCards(filmesFiltrados);
	atualizarRodape(filmes.length);
}

function configurarLista() {
	if (!document.querySelector("#lista")) return;

	document.querySelector("#busca").addEventListener("input", renderizarFilmes);
	const dadosSalvos = localStorage.getItem(CHAVE_FILMES);
	filmes = dadosSalvos === null ? [...filmesIniciais] : carregarFilmes();
	if (dadosSalvos === null) salvarFilmes(filmes);

	document.querySelector("nav").addEventListener("click", (evento) => {
		const botao = evento.target.closest("button[data-status]");
		if (!botao) return;
		document.querySelector("nav .ativo").classList.remove("ativo");
		botao.classList.add("ativo");
		renderizarFilmes();
	});
	document.querySelector("#lista").addEventListener("click", (evento) => {
		const botaoEditar = evento.target.closest(".btn-editar");
		if (botaoEditar) {
			location.href = `adicionar.html?id=${encodeURIComponent(botaoEditar.dataset.id)}`;
			return;
		}

		const botaoRemover = evento.target.closest(".btn-remover");
		if (!botaoRemover) return;

		if (window.confirm("Deseja remover este filme?")) {
			filmes = filmes.filter((filme) => filme.id !== botaoRemover.dataset.id);
			salvarFilmes(filmes);
			renderizarFilmes();
		}
	});
	renderizarFilmes();
}

function configurarFormulario() {
	const formulario = document.querySelector("#form-filme");
	if (!formulario) return;

	const parametros = new URLSearchParams(location.search);
	const idEdicao = parametros.get("id");
	const filmes = carregarFilmes();
	const filmeEdicao = filmes.find((filme) => filme.id === idEdicao);
	if (idEdicao && filmeEdicao) {
		document.querySelector("#titulo-pagina").textContent = "Editar filme";
		for (const campo of formulario.elements) {
			if (campo.name && filmeEdicao[campo.name] !== undefined) {
				campo.value = filmeEdicao[campo.name];
			}
		}
	}

	formulario.addEventListener("submit", (evento) => {
		evento.preventDefault();
		const dados = Object.fromEntries(new FormData(formulario));
		const filme = {
			id: filmeEdicao?.id ?? String(Date.now()),
			titulo: dados.titulo.trim(),
			ano: Number(dados.ano),
			genero: dados.genero.trim(),
			poster: dados.poster.trim(),
			status: dados.status,
			nota: Number(dados.nota),
			comentario: dados.comentario.trim(),
		};

		const atualizados = filmeEdicao
			? filmes.map((item) => item.id === filmeEdicao.id ? filme : item)
			: [...filmes, filme];
		salvarFilmes(atualizados);
		location.href = "index.html";
	});
}

configurarLista();
configurarFormulario();
