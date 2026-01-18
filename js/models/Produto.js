export class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
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
}

