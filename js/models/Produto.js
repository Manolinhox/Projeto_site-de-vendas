export class Produto {
  constructor(id, nome, preco, estoque = null, image = null) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque; // null = estoque ilimitado
    this.image = image;     // Base64 (string) ou null
  }

  // ================= VALIDAÇÃO =================
  validar() {
    if (!this.nome || this.nome.trim() === "") {
      alert("Nome do produto inválido");
      return false;
    }

    if (this.preco <= 0 || isNaN(this.preco)) {
      alert("Preço inválido");
      return false;
    }

    if (
      this.estoque != null &&
      (this.estoque < 0 || !Number.isInteger(this.estoque))
    ) {
      alert("Estoque inválido");
      return false;
    }

    if (this.image && typeof this.image !== "string") {
      alert("Imagem inválida");
      return false;
    }

    return true;
  }

  // ================= GETTERS =================
  getId() { return this.id; }
  getNome() { return this.nome; }
  getPreco() { return this.preco; }
  getEstoque() { return this.estoque; }
  getImage() { return this.image; }

  // ================= SETTERS =================
  setNome(nome) { this.nome = nome; }
  setPreco(preco) { this.preco = preco; }
  setEstoque(estoque) { this.estoque = estoque; }
  setImage(image) { this.image = image; }
}