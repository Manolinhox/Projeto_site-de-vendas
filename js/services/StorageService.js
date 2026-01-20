export class StorageService {

  static salvarProduto(produto) {
    localStorage.setItem("produto", JSON.stringify(produto));
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