//--------- Imports ------------
import { Produto } from "./models/Produto.js";
import { StorageService } from "./services/StorageService.js";

// -------------- Globais -----------
const links = document.querySelectorAll("[data-page]");
const paginas = document.querySelectorAll(".pagina");
const form = document.getElementById("form-produto");
const btnCadastrarProduto = document.getElementById("btnCadastrarProduto");

// -------------- Navegação de Páginas -----------
function mostrarPagina(id) {
  paginas.forEach(p => p.classList.remove("ativa"));

  const pagina = document.getElementById(id);
  if (pagina) {
    pagina.classList.add("ativa");
  }
}

// Navegação pelo menu
links.forEach(link => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    mostrarPagina(link.dataset.page);
  });
});

// Botão de cadastro dentro da página Produtos
btnCadastrarProduto.addEventListener("click", () => {
  mostrarPagina("cadastro-produto");
});

// ----------- Formulário de Produto -----------------
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("nomeProduto").value;
  const preco = parseFloat(document.getElementById("precoProduto").value);

  const produto = new Produto(GerarID(), nome, preco);

  if (produto.validar()) {
    StorageService.salvarProduto(produto);//
    console.log("Produto cadastrado:", produto);//

    form.reset();
    mostrarPagina("produtos");
  }
});


//Gerar ID
function GerarID(){
    return Math.random().toString(36).slice(2,11);
}



