export class Carrinho {
  constructor() {
    this.itens = []; 
    // [{ produto, quantidade }]
  }

  // ---------- CONSULTAS ----------
  getItens() {
    return this.itens;
  }

  getItemPorId(id) {
    return this.itens.find(item => item.produto.id === id);
  }

  getTotalItens() {
    return this.itens.reduce(
      (total, item) => total + item.quantidade,
      0
    );
  }

  getTotalValor() {
    return this.itens.reduce(
      (total, item) => total + item.produto.preco * item.quantidade,
      0
    );
  }

  // ---------- AÇÕES ----------
  setItens(itens) {
    this.itens = itens;
  }

  adicionarProduto(produto) {
    const item = this.getItemPorId(produto.id);

    const estoqueDisponivel =
      produto.estoque == null ? Infinity : produto.estoque;

    if (item) {
      if (item.quantidade < estoqueDisponivel) {
        item.quantidade++;
      }
    } else {
      if (estoqueDisponivel > 0) {
        this.itens.push({
          produto,
          quantidade: 1
        });
      }
    }
  }

  aumentar(id) {
    const item = this.getItemPorId(id);
    if (!item) return;

    const estoqueDisponivel =
      item.produto.estoque == null ? Infinity : item.produto.estoque;

    if (item.quantidade < estoqueDisponivel) {
      item.quantidade++;
    }
  }

  diminuir(id) {
    const item = this.getItemPorId(id);
    if (!item) return;

    item.quantidade--;

    if (item.quantidade <= 0) {
      this.remover(id);
    }
  }

  remover(id) {
    this.itens = this.itens.filter(
      item => item.produto.id !== id
    );
  }

  limpar() {
    this.itens = [];
  }
}
