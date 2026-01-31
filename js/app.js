// --------- Imports ------------
import { Produto } from "./models/Produto.js";
import { Carrinho } from "./models/Carrinho.js";
import { StorageService } from "./services/StorageService.js";
import { UIService } from "./ui/UIService.js";

// -------------- DOM -----------
const links = document.querySelectorAll("[data-page]");
const paginas = document.querySelectorAll(".pagina");
const form = document.getElementById("form-produto");
const btnCadastrarProduto = document.getElementById("btnCadastrarProduto");
const inputBusca = document.getElementById("busca-produto");
const btnFinalizarCompra = document.querySelector(".btn-finalizar");
const contadorCarrinho = document.getElementById("count-itens");

const inputImagem = document.getElementById("imagemProduto");

// -------------- Estado -----------
let produtoEmEdicao = null;
let estadoProdutos = [];
const carrinho = new Carrinho();

// ================= INICIALIZAÇÃO =================
document.addEventListener("DOMContentLoaded", () => {
  atualizarEstadoProdutos();

  const itensSalvos = StorageService.carregarCarrinho();
  carrinho.setItens(itensSalvos);

  atualizarCarrinhoUI();
});

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

    produtoEmEdicao = new Produto(
      dados.id,
      dados.nome,
      dados.preco,
      dados.estoque,
      dados.image || null
    );

    document.getElementById("nomeProduto").value = produtoEmEdicao.nome;
    document.getElementById("precoProduto").value = produtoEmEdicao.preco;
    inputImagem.value = "";

    mostrarPagina("cadastro-produto");
  }

  // ---------- EXCLUIR ----------
  if (action === "excluir") {
    StorageService.removerProduto(id);
    atualizarEstadoProdutos();
    UIService.mostrarFeedback("Produto removido!");
  }

  // ---------- ADICIONAR AO CARRINHO ----------
  if (action === "carrinho") {
    const produto = estadoProdutos.find(p => p.id === id);
    if (!produto) return;

    carrinho.adicionarProduto(produto);
    StorageService.salvarCarrinho(carrinho.getItens());
    atualizarCarrinhoUI();
  }

  if (action === "aumentar") {
    carrinho.aumentar(id);
    StorageService.salvarCarrinho(carrinho.getItens());
    atualizarCarrinhoUI();
  }

  if (action === "diminuir") {
    carrinho.diminuir(id);
    StorageService.salvarCarrinho(carrinho.getItens());
    atualizarCarrinhoUI();
  }

  contadorCarrinho.innerHTML = carrinho.getTotalItens();
});

// ================= NAVEGAÇÃO =================
function mostrarPagina(id) {
  paginas.forEach(p => p.classList.remove("ativa"));

  const pagina = document.getElementById(id);
  if (!pagina) return;

  pagina.classList.add("ativa");

  if (id === "produtos") atualizarEstadoProdutos();
  if (id === "carrinho") atualizarCarrinhoUI();
}

links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarPagina(link.dataset.page);
  });
});

btnCadastrarProduto.addEventListener("click", () => {
  mostrarPagina("cadastro-produto");
});

// ================= FORMULÁRIO =================
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nomeProduto").value;
  const preco = parseFloat(document.getElementById("precoProduto").value);
  const arquivoImagem = inputImagem.files[0] || null;

  let imagemBase64 = null;

  if (arquivoImagem) {
    imagemBase64 = await converterParaBase64(arquivoImagem);
  }

  // ----- EDIÇÃO -----
  if (produtoEmEdicao) {
    produtoEmEdicao.setNome(nome);
    produtoEmEdicao.setPreco(preco);

    if (imagemBase64) {
      produtoEmEdicao.setImage(imagemBase64);
    }

    if (!produtoEmEdicao.validar()) return;

    StorageService.salvarProduto(produtoEmEdicao);
    UIService.mostrarFeedback("Produto atualizado!");
    produtoEmEdicao = null;
  }

  // ----- NOVO PRODUTO -----
  else {
    const produto = new Produto(
      GerarID(),
      nome,
      preco,
      10,
      imagemBase64
    );

    if (!produto.validar()) return;

    StorageService.salvarProduto(produto);
    UIService.mostrarFeedback("Produto cadastrado!");
  }

  form.reset();
  mostrarPagina("produtos");
});

// ================= BUSCA =================
inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase();

  const filtrados = estadoProdutos.filter(produto =>
    produto.nome.toLowerCase().includes(termo)
  );

  UIService.renderizarProdutos(filtrados);
});

// ================= FINALIZAR COMPRA =================
btnFinalizarCompra.addEventListener("click", finalizarCompra);

function finalizarCompra() {
  const itensCarrinho = carrinho.getItens();
  const produtos = StorageService.carregarProdutos();

  if (itensCarrinho.length === 0) {
    UIService.mostrarFeedback("Carrinho vazio!");
    return;
  }

  itensCarrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);
    if (!produto) return;

    if (produto.estoque < item.quantidade) {
      UIService.mostrarFeedback(
        `Estoque insuficiente para ${produto.nome}`
      );
      throw new Error("Estoque insuficiente");
    }

    produto.estoque -= item.quantidade;
    StorageService.salvarProduto(produto);
  });

  carrinho.limpar();
  StorageService.limparCarrinho();

  atualizarEstadoProdutos();
  atualizarCarrinhoUI();

  UIService.mostrarFeedback("Compra finalizada com sucesso!");
}

// ================= ESTADO =================
function atualizarEstadoProdutos() {
  estadoProdutos = StorageService.carregarProdutos();
  UIService.renderizarProdutos(estadoProdutos);
}

// ================= UI DO CARRINHO =================
function atualizarCarrinhoUI() {
  const itens = carrinho.getItens();
  UIService.renderizarCarrinho(itens);
  UIService.renderizarResumo(itens);
}

// ================= UTIL =================
function GerarID() {
  return Math.random().toString(36).slice(2, 11);
}

function converterParaBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
