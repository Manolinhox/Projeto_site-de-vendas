export class StorageService {

  static salvarProdutos(produtos) {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }

  static carregarProdutos() {
    return JSON.parse(localStorage.getItem("produtos")) || [];
  }

  static salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  static carregarCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
  }
}