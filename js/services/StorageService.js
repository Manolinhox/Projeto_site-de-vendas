export class StorageService {

  /* ======================
     PRODUTOS (CATÁLOGO)
     ====================== */

  static salvarProduto(produto) {
    const ids = this.carregarIds();

    if (!ids.includes(produto.id)) {
      ids.push(produto.id);
      localStorage.setItem("produtos_ids", JSON.stringify(ids));
    }

    localStorage.setItem(
      `produto_${produto.id}`,
      JSON.stringify(produto)
    );
  }

  static carregarProdutos() {
    const ids = this.carregarIds();

    return ids
      .map(id => {
        const dados = localStorage.getItem(`produto_${id}`);
        return dados ? JSON.parse(dados) : null;
      })
      .filter(p => p !== null);
  }

  static removerProduto(id) {
    localStorage.removeItem(`produto_${id}`);

    const ids = this.carregarIds().filter(pid => pid !== id);
    localStorage.setItem("produtos_ids", JSON.stringify(ids));
  }

  static carregarIds() {
    return JSON.parse(localStorage.getItem("produtos_ids")) || [];
  }

  /* ---------- CARRINHO ---------- */
  static carregarCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
  }

  static salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  static limparCarrinho() {
    localStorage.removeItem("carrinho");
  }
}
