class UIService {
  static renderizarProdutos(produtos) {
    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";

    if (produtos.length === 0) {
      lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    produtos.forEach(produto => {
      const item = document.createElement("div");
      item.classList.add("produto");

      item.innerHTML = `
        <strong>${produto.nome}</strong>
        <p>R$ ${produto.preco}</p>
      `;

      lista.appendChild(item);
    });
  }
}
