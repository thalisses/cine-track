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
let editandoId = null;

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

function atualizarRodape(total = TOTAL) {
	const rodape = document.querySelector("#total-filmes");
	if (rodape) rodape.textContent = `CineTrack © 2026 · ${total} filmes cadastrados.`;
}

function criarCard(filme) {
	const card = document.createElement("article");
	card.className = "card";
	card.dataset.id = filme.id;

	if (filme.poster) {
		const poster = document.createElement("img");
		poster.src = filme.poster;
		poster.alt = `Cartaz do filme ${filme.titulo}`;
		card.append(poster);
	}

	const titulo = document.createElement("h2");
	titulo.textContent = filme.titulo;
	const anoGenero = document.createElement("p");
	anoGenero.textContent = `${filme.ano} • ${filme.genero}`;
	const nota = document.createElement("p");
	nota.textContent = `Nota: ${estrelas(Number(filme.nota))}`;
	const status = document.createElement("p");
	status.className = `status ${rotuloStatus(filme.status) === "quero" ? "quero" : filme.status}`;
	status.textContent = rotuloStatus(filme.status);
	card.append(titulo, anoGenero, nota, status);

	if (filme.comentario) {
		const comentario = document.createElement("p");
		comentario.textContent = filme.comentario;
		card.append(comentario);
	}

	const acoes = document.createElement("span");
	acoes.className = "acoes";
	const editar = document.createElement("button");
	editar.type = "button";
	editar.className = "btn-editar";
	editar.dataset.id = filme.id;
	editar.textContent = "Editar";
	const remover = document.createElement("button");
	remover.type = "button";
	remover.className = "btn-remover";
	remover.dataset.id = filme.id;
	remover.textContent = "Remover";
	acoes.append(editar, remover);
	card.append(acoes);

	return card;
}

function renderizarCards(lista) {
	const secao = document.querySelector("#lista");
	if (!secao) return;

	const fragmento = document.createDocumentFragment();
	if (lista.length === 0) {
		const vazio = document.createElement("p");
		vazio.textContent = "Nenhum filme encontrado.";
		fragmento.append(vazio);
	} else {
		for (const filme of lista) fragmento.append(criarCard(filme));
	}
	secao.replaceChildren(fragmento);
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
			const filme = filmes.find((item) => item.id === botaoEditar.dataset.id);
			if (filme) abrir(filme);
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

function validarFilme(filme) {
	const erros = [];
	if (!filme.titulo) erros.push("Informe o título do filme.");
	if (!Number.isInteger(filme.ano) || filme.ano < 1888 || filme.ano > 2030) {
		erros.push("O ano deve ser um número entre 1888 e 2030.");
	}
	if (!filme.genero) erros.push("Informe o gênero do filme.");
	if (filme.poster) {
		try {
			const url = new URL(filme.poster, "https://cinetrack.local/");
			if (url.protocol !== "http:" && url.protocol !== "https:") {
				erros.push("O pôster deve usar uma URL HTTP ou HTTPS.");
			}
		} catch {
			erros.push("Informe uma URL válida para o pôster.");
		}
	}
	if (!["assistido", "assistindo", "quero assistir"].includes(filme.status)) {
		erros.push("Selecione um status válido.");
	}
	if (!Number.isInteger(filme.nota) || filme.nota < 1 || filme.nota > 5) {
		erros.push("A nota deve ser um número inteiro entre 1 e 5.");
	}
	return erros;
}

function gerarId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function abrir(filme = null) {
	const formulario = document.querySelector("#form-filme");
	formulario.reset();
	document.querySelector("#erros-form").replaceChildren();
	document.querySelector("#erros-form").hidden = true;
	editandoId = filme?.id ?? null;
	document.querySelector("#titulo-pagina").textContent = filme ? "Editar filme" : "Adicionar filme";

	if (filme) {
		for (const campo of formulario.elements) {
			if (campo.name && filme[campo.name] !== undefined) {
				campo.value = filme[campo.name];
			}
		}
	}
	document.querySelector("#modal").hidden = false;
	document.querySelector("#titulo").focus();
}

	function fechar() {
		document.querySelector("#modal").hidden = true;
		editandoId = null;
	}

function configurarModal() {
	const formulario = document.querySelector("#form-filme");
	if (!formulario) return;

	document.querySelector("#btn-adicionar").addEventListener("click", () => abrir());
	document.querySelector("#cancelar").addEventListener("click", fechar);
	document.querySelector("#modal").addEventListener("click", (evento) => {
		if (evento.target.id === "modal") fechar();
	});
	document.addEventListener("keydown", (evento) => {
		if (evento.key === "Escape" && !document.querySelector("#modal").hidden) fechar();
	});
	formulario.addEventListener("submit", (evento) => {
		evento.preventDefault();
		const dados = Object.fromEntries(new FormData(formulario));
		const filme = {
			titulo: dados.titulo.trim(),
			ano: Number(dados.ano),
			genero: dados.genero.trim(),
			poster: dados.poster.trim(),
			status: dados.status,
			nota: Number(dados.nota),
			comentario: dados.comentario.trim(),
		};
		const erros = validarFilme(filme);
		const listaErros = document.querySelector("#erros-form");
		listaErros.replaceChildren(...erros.map((mensagem) => {
			const item = document.createElement("li");
			item.textContent = mensagem;
			return item;
		}));
		listaErros.hidden = erros.length === 0;
		if (erros.length > 0) return;

		if (editandoId) {
			filmes = filmes.map((item) => item.id === editandoId ? { ...item, ...filme } : item);
		} else {
			filmes = [...filmes, { id: gerarId(), ...filme }];
		}
		salvarFilmes(filmes);
		renderizarFilmes();
		fechar();
	});
}

configurarLista();
configurarModal();
