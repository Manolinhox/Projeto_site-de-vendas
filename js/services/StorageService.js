export class StorageService {

  static salvarProduto(id, produto) {
    localStorage.setItem(id, JSON.stringify(produto));
  }

  static carregarProduto() {
    return JSON.parse(localStorage.getItem("produto")) || [];
  }

  static salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  static carregarCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
  }
}