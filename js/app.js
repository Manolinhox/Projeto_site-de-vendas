//--------- Imports ------------
import { Produto } from "./models/Produto.js";
import { StorageService } from "./services/StorageService.js";
import { UIService } from "./ui/UIService.js";

// -------------- Globais -----------
const links = document.querySelectorAll("[data-page]");
const paginas = document.querySelectorAll(".pagina");
const form = document.getElementById("form-produto");
const btnCadastrarProduto = document.getElementById("btnCadastrarProduto");

// ------- Ações ------
let produtoEmEdicao = null;

document.addEventListener("click", (event) => {
  const botao = event.target;
  const id = botao.dataset.id;

  if (!id) return;

  // ----- EDITAR ------
  if (botao.dataset.action == "editar") {
    const produtos = StorageService.carregarProdutos();
    const dadosProduto = produtos.find(p => p.id == id);
    
    if (!dadosProduto) return;

    produtoEmEdicao = new Produto(
      dadosProduto.id,
      dadosProduto.nome,
      dadosProduto.preco
    );

    document.getElementById("nomeProduto").value = produtoEmEdicao.nome;
    document.getElementById("precoProduto").value = produtoEmEdicao.preco;

    mostrarPagina("cadastro-produto");
  }

  else if (botao.dataset.action == "excluir"){
    StorageService.removerProduto(id);

    const produtosAtualizados = StorageService.carregarProdutos();
    UIService.renderizarProdutos(produtosAtualizados);
  }

});


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
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("nomeProduto").value;
  const preco = parseFloat(document.getElementById("precoProduto").value);

  const produto = new Produto(GerarID(), nome, preco);

  if (produtoEmEdicao) { // Se for um produto já existente que será editado
    produtoEmEdicao.nome = nome;
    produtoEmEdicao.preco = preco;
    
    if (!produtoEmEdicao.validar()) return;

    StorageService.salvarProduto(produtoEmEdicao);
    UIService.mostrarFeedback("Produto salvo com Sucesso!");

    produtoEmEdicao = null; // limpa o produto
  }

  else { // Senão, um novo produto é criado
    const produto = new Produto(GerarID(), nome, preco);

    if (!produto.validar()) return;

    StorageService.salvarProduto(produto);
    UIService.mostrarFeedback("Produto salvo com Sucesso!");
  }

  form.reset();
  mostrarPagina("produtos");
});

// Util
function GerarID() {
  return Math.random().toString(36).slice(2, 11);
};
