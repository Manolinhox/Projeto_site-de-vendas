import { ItemCarrinho } from "./ItemCarrinho.js";
import { StorageService } from "../services/StorageService.js"; // 🔹 ADICIONADO

export class Carrinho {
  constructor() {
    this.itens = [];
    this.carregarDoStorage(); // 🔹 ADICIONADO
  }

  // 🔹 ADICIONADO
  carregarDoStorage() {
    const itensSalvos = StorageService.carregarCarrinho();

    this.itens = itensSalvos.map(item =>
      new ItemCarrinho(item.produto, item.quantidade)
    );
  }

  // 🔹 ADICIONADO
  salvar() {
    StorageService.salvarCarrinho(this.itens);
  }

  adicionarItem(produto) {
     console.log("adicionarItem chamado", produto);
    const item = this.itens.find(
      i => i.produto.id === produto.id
    );

    if (item) {
      if (item.quantidade < produto.estoque) {
        item.quantidade++;
      }
    } else {
      this.itens.push(new ItemCarrinho(produto));
    }

    this.salvar(); // 🔹 ADICIONADO
  }

  removerItem(produtoId) {
    this.itens = this.itens.filter(
      item => item.produto.id !== produtoId
    );

    this.salvar(); // 🔹 ADICIONADO
  }

  atualizarQuantidade(produtoId, quantidade) {
    const item = this.itens.find(
      item => item.produto.id === produtoId
    );

    if (!item) return;

    if (quantidade >= 1 && quantidade <= item.produto.estoque) {
      item.quantidade = quantidade;
      this.salvar(); // 🔹 ADICIONADO
    }
  }

  calcularTotal() {
    return this.itens.reduce(
      (total, item) => total + item.calcularSubtotal(),
      0
    );
  }

  limpar() {
    this.itens = [];
    StorageService.limparCarrinho(); // 🔹 ADICIONADO
  }
}



