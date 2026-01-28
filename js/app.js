//--------- Imports ------------
import { Produto } from "./models/Produto.js";
import { StorageService } from "./services/StorageService.js";
import { UIService } from "./ui/UIService.js";

// -------------- Globais -----------
const links = document.querySelectorAll("[data-page]");
const paginas = document.querySelectorAll(".pagina");
const form = document.getElementById("form-produto");
const btnCadastrarProduto = document.getElementById("btnCadastrarProduto");

// -------------- Estado -----------
let produtoEmEdicao = null;

// ================= CARRINHO (MODELO BÁSICO) =================
let carrinho = [];

// ================= AÇÕES GLOBAIS =================
document.addEventListener("click", (event) => {
  const botao = event.target;
  const action = botao.dataset.action;
  const id = botao.dataset.id;

  if (!action || !id) return;

  // ---------- EDITAR ----------
  if (action === "editar") {
    const produtos = StorageService.carregarProdutos();
    const dados = produtos.find(p => p.id === id);
    if (!dados) return;

    produtoEmEdicao = new Produto(dados.id, dados.nome, dados.preco);

    document.getElementById("nomeProduto").value = produtoEmEdicao.nome;
    document.getElementById("precoProduto").value = produtoEmEdicao.preco;

    mostrarPagina("cadastro-produto");
  }

  // ---------- EXCLUIR ----------
  if (action === "excluir") {
    StorageService.removerProduto(id);

    UIService.renderizarProdutos(
      StorageService.carregarProdutos()
    );

    UIService.mostrarFeedback("Produto removido!");
  }

  // ---------- CARRINHO ----------
  if (action === "carrinho") {
    const produtos = StorageService.carregarProdutos();
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    adicionarAoCarrinho(produto);
  }

  if (action === "aumentar") {
    aumentarQuantidade(id);
  }

  if (action === "diminuir") {
    diminuirQuantidade(id);
  }
});

// ================= NAVEGAÇÃO =================
function mostrarPagina(id) {
  paginas.forEach(p => p.classList.remove("ativa"));

  const pagina = document.getElementById(id);
  if (!pagina) return;

  pagina.classList.add("ativa");

  if (id === "produtos") {
    UIService.renderizarProdutos(
      StorageService.carregarProdutos()
    );
  }

  if (id === "carrinho") {
    atualizarCarrinhoUI();
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

// ================= FORMULÁRIO =================
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("nomeProduto").value;
  const preco = parseFloat(document.getElementById("precoProduto").value);

  // ----- EDIÇÃO -----
  if (produtoEmEdicao) {
    produtoEmEdicao.nome = nome;
    produtoEmEdicao.preco = preco;

    if (!produtoEmEdicao.validar()) return;

    StorageService.salvarProduto(produtoEmEdicao);
    UIService.mostrarFeedback("Produto atualizado!");

    produtoEmEdicao = null;
  }

  // ----- NOVO PRODUTO -----
  else {
    const produto = new Produto(GerarID(), nome, preco);

    if (!produto.validar()) return;

    StorageService.salvarProduto(produto);
    UIService.mostrarFeedback("Produto cadastrado!");
  }

  form.reset();
  mostrarPagina("produtos");
});

// ================= FUNÇÕES DE CARRINHO =================
function adicionarAoCarrinho(produto) {
  const item = carrinho.find(p => p.id === produto.id);

  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1
    });
  }

  atualizarCarrinhoUI();
}

function aumentarQuantidade(id) {
  const item = carrinho.find(p => p.id === id);
  if (!item) return;

  item.quantidade++;
  atualizarCarrinhoUI();
}

function diminuirQuantidade(id) {
  const item = carrinho.find(p => p.id === id);
  if (!item) return;

  if (item.quantidade > 1) {
    item.quantidade--;
  } else {
    carrinho = carrinho.filter(p => p.id !== id);
  }

  atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
  UIService.renderizarCarrinho(carrinho);
  UIService.renderizarResumo(carrinho);
}

// ================= UTIL =================
function GerarID() {
  return Math.random().toString(36).slice(2, 11);
}
