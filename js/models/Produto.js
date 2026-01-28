export class Produto {
  constructor(id, nome, preco) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    this.estoque = 10; // Cada produto tem por definição 10 no estoque (para testes)
  }

  validar() {
    if (!this.nome || this.nome.trim() === "") {
      alert("Nome do produto inválido");
      return false;
    }

    if (this.preco <= 0 || isNaN(this.preco)) {
      alert("Preço inválido");
      return false;
    }

    return true;
  }
  

  // Getters e Setters

  getId() {
    return this.id;
  }

  getNome() {
    return this.nome;
  }

  getPreco() {
    return this.preco;
  }

  setNome(nome) {
    this.nome = nome;
  }

  setPreco(preco) {
    this.preco = preco;
  }
}

