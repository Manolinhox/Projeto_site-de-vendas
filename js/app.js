//--------- Imports ------------
import { Produto } from "./models/Produto.js";
import { StorageService } from "./services/StorageService.js";
import { UIService } from "./ui/UIService.js";

// -------------- Globais -----------
const links = document.querySelectorAll("[data-page]");
const paginas = document.querySelectorAll(".pagina");
const form = document.getElementById("form-produto");
const btnCadastrarProduto = document.getElementById("btnCadastrarProduto");
const inputBusca = document.getElementById("busca-produto"); // <-- ADICIONADO

// -------------- Estado -----------
let produtoEmEdicao = null;
let estadoProdutos = []; // <-- ADICIONADO (estado central)

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
    const dados = estadoProdutos.find(p => p.id === id);
    if (!dados) return;

    produtoEmEdicao = new Produto(dados.id, dados.nome, dados.preco);

    document.getElementById("nomeProduto").value = produtoEmEdicao.nome;
    document.getElementById("precoProduto").value = produtoEmEdicao.preco;

    mostrarPagina("cadastro-produto");
  }

  // ---------- EXCLUIR ----------
  if (action === "excluir") {
    StorageService.removerProduto(id);
    atualizarEstadoProdutos();
    UIService.mostrarFeedback("Produto removido!");
  }

  // ---------- CARRINHO ----------
  if (action === "carrinho") {
    const produto = estadoProdutos.find(p => p.id === id);
    if (!produto) return;

    adicionarAoCarrinho(produto);
  }

  if (action === "aumentar") aumentarQuantidade(id);
  if (action === "diminuir") diminuirQuantidade(id);
});

// ================= NAVEGAÇÃO =================
function mostrarPagina(id) {
  paginas.forEach(p => p.classList.remove("ativa"));

  const pagina = document.getElementById(id);
  if (!pagina) return;

  pagina.classList.add("ativa");

  if (id === "produtos") {
    atualizarEstadoProdutos();
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

// ================= BUSCA DE PRODUTOS =================
inputBusca?.addEventListener("input", () => { 
  const termo = inputBusca.value.toLowerCase();

  const filtrados = estadoProdutos.filter(produto =>
    produto.nome.toLowerCase().includes(termo)
  );

  UIService.renderizarProdutos(filtrados);
});

// ================= ESTADO =================
function atualizarEstadoProdutos() {
  estadoProdutos = StorageService.carregarProdutos();
  UIService.renderizarProdutos(estadoProdutos);
}

// ================= FUNÇÕES DE CARRINHO =================
function adicionarAoCarrinho(produto) {
  const item = carrinho.find(p => p.id === produto.id);

  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
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
