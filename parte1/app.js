const CHAVE_FILMES = "cinetrack-filmes";
const filmesIniciais = [
	{ titulo: "A Origem", ano: 2010, genero: "Ficção científica", poster: "../assets/a-origem.jpg", status: "assistido", nota: 5, comentario: "" },
	{ titulo: "Parasita", ano: 2019, genero: "Suspense", poster: "../assets/parasita.jpg", status: "assistido", nota: 4, comentario: "" },
	{ titulo: "O Auto da Compadecida", ano: 2000, genero: "Comédia", poster: "../assets/o-alto-da-compadecida.jpg", status: "assistido", nota: 4, comentario: "" },
	{ titulo: "Duna: Parte Dois", ano: 2024, genero: "Ficção científica", poster: "../assets/duna-parte-dois.jpg", status: "assistindo", nota: 4, comentario: "" },
	{ titulo: "Interestelar", ano: 2014, genero: "Ficção científica", poster: "../assets/interestelar.jpg", status: "quero assistir", nota: 4, comentario: "" },
	{ titulo: "Cidade de Deus", ano: 2002, genero: "Crime", poster: "../assets/cidade-de-deus.jpg", status: "quero assistir", nota: 4, comentario: "" },
].map((filme, indice) => ({ id: String(indice + 1), ...filme }));

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

function criarElemento(tag, texto, classe) {
	const elemento = document.createElement(tag);
	if (texto !== undefined) elemento.textContent = texto;
	if (classe) elemento.className = classe;
	return elemento;
}

function renderizarFilmes() {
	const lista = document.querySelector("#lista");
	if (!lista) return;

	const busca = document.querySelector("#busca").value.trim().toLocaleLowerCase("pt-BR");
	const filtro = document.querySelector("nav .ativo").dataset.filtro;
	const filmes = carregarFilmes().filter((filme) => {
		const correspondeBusca = filme.titulo.toLocaleLowerCase("pt-BR").includes(busca);
		return correspondeBusca && (filtro === "todos" || filme.status === filtro);
	});

	lista.replaceChildren();
	if (filmes.length === 0) {
		lista.append(criarElemento("p", "Nenhum filme encontrado."));
		return;
	}

	for (const filme of filmes) {
		const card = criarElemento("article", undefined, "card");
		if (filme.poster) {
			const poster = criarElemento("img");
			poster.src = filme.poster;
			poster.alt = `Cartaz do filme ${filme.titulo}`;
			card.append(poster);
		}
		card.append(
			criarElemento("h2", filme.titulo),
			criarElemento("p", `${filme.ano} • ${filme.genero}`),
			criarElemento("p", `Nota: ${"★".repeat(filme.nota)}${"☆".repeat(5 - filme.nota)}`),
			criarElemento("p", filme.status, `status ${filme.status === "quero assistir" ? "quero" : filme.status}`),
		);
		if (filme.comentario) card.append(criarElemento("p", filme.comentario));

		const acoes = criarElemento("span", undefined, "acoes");
		const editar = criarElemento("button", "Editar");
		editar.type = "button";
		editar.dataset.acao = "editar";
		editar.dataset.id = filme.id;
		const remover = criarElemento("button", "Remover");
		remover.type = "button";
		remover.dataset.acao = "remover";
		remover.dataset.id = filme.id;
		acoes.append(editar, remover);
		card.append(acoes);
		lista.append(card);
	}
}

function configurarLista() {
	if (!document.querySelector("#lista")) return;

	document.querySelector("#busca").addEventListener("input", renderizarFilmes);
	document.querySelector("nav").addEventListener("click", (evento) => {
		const botao = evento.target.closest("button[data-filtro]");
		if (!botao) return;
		document.querySelector("nav .ativo").classList.remove("ativo");
		botao.classList.add("ativo");
		renderizarFilmes();
	});
	document.querySelector("#lista").addEventListener("click", (evento) => {
		const botao = evento.target.closest("button[data-acao]");
		if (!botao) return;

		if (botao.dataset.acao === "editar") {
			location.href = `adicionar.html?id=${encodeURIComponent(botao.dataset.id)}`;
			return;
		}

		if (window.confirm("Deseja remover este filme?")) {
			salvarFilmes(carregarFilmes().filter((filme) => filme.id !== botao.dataset.id));
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
