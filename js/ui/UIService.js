export class UIService {

  static renderizarProdutos(produtos = []) { // <-- proteção
    const container = document.getElementById("lista-produtos");

    if (!container) return; // <-- evita erro se a página não estiver ativa

    container.innerHTML = "";

    if (produtos.length === 0) {
      container.innerHTML = "<p>Nenhum produto cadastrado.</p>";
      return;
    }

    produtos.forEach(produto => {
      const card = document.createElement("div");
      card.classList.add("produto-card");

      card.innerHTML = `
        <h3>${produto.nome}</h3>
        <p>Preço: R$ ${produto.preco.toFixed(2)}</p>

        <div class="acoes">
          <button data-action="editar" data-id="${produto.id}">Editar</button>
          <button data-action="excluir" data-id="${produto.id}">Excluir</button>
          <button data-action="carrinho" data-id="${produto.id}">
            Adicionar ao Carrinho
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  static mostrarFeedback(mensagem, tipo = "sucesso") { 
    const feedback = document.createElement("div");
    feedback.className = `feedback ${tipo}`;
    feedback.innerText = mensagem;

    document.body.appendChild(feedback);

    setTimeout(() => feedback.remove(), 2500);
  }
}

export class UIService {
  static renderizarResumoCarrinho(carrinho) {
    const resumo = document.querySelector("#resumo-carrinho");

    resumo.innerHTML = `
      <p>Total de itens: ${carrinho.itens.length}</p>
      <p><strong>Total: R$ ${carrinho.calcularTotal().toFixed(2)}</strong></p>
      <button id="btn-finalizar">Finalizar Compra</button>
    `;

    document
      .querySelector("#btn-finalizar")
      .addEventListener("click", () => {
        document.dispatchEvent(new Event("finalizarCompra"));
      });

  }
  static mostrarMensagem(tipo, texto) {
    const container = document.querySelector("#mensagens");

    container.innerHTML = `
      <div class="mensagem ${tipo}">
        ${texto}
      </div>
    `;

    setTimeout(() => {
      container.innerHTML = "";
    }, 3000);
  }
}
