//--------- Imports ------------
import { Produto } from "./models/Produto.js";
import { StorageService } from "./services/StorageService.js";
import { UIService } from "./ui/UIService.js";

// -------------- Globais -----------
const links = document.querySelectorAll("[data-page]");
const paginas = document.querySelectorAll(".pagina");
const form = document.getElementById("form-produto");
const btnCadastrarProduto = document.getElementById("btnCadastrarProduto");

// -------------- Navegação -----------
function mostrarPagina(id) {
  paginas.forEach(p => p.classList.remove("ativa"));

  const pagina = document.getElementById(id);
  if (pagina) {
    pagina.classList.add("ativa");

    if (id === "produtos") {
      const produtos = StorageService.carregarProdutos();
      UIService.renderizarProdutos(produtos);
    }
  }
}

// Menu
links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarPagina(link.dataset.page);
  });
});

// Botão cadastrar
btnCadastrarProduto.addEventListener("click", () => {
  mostrarPagina("cadastro-produto");
});

// -------- Formulário --------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nomeProduto").value;
  const preco = parseFloat(document.getElementById("precoProduto").value);

  const produto = new Produto(GerarID(), nome, preco);

  if (!produto.validar()) return;

  const produtos = StorageService.carregarProdutos();
  produtos.push(produto);

  StorageService.salvarProdutos(produtos);

  form.reset();
  mostrarPagina("produtos");
});

// Util
function GerarID() {
  return Math.random().toString(36).slice(2, 11);
}
