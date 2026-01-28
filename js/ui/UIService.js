export class UIService {

  // ================= PRODUTOS =================
  static renderizarProdutos(produtos = []) {
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
          <button data-action="editar" data-id="${produto.id}">
            Editar
          </button>

          <button data-action="excluir" data-id="${produto.id}">
            Excluir
          </button>

          <button 
            data-action="carrinho" 
            data-id="${produto.id}">
            Adicionar ao Carrinho
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // ================= CARRINHO =================
  static renderizarCarrinho(itens = []) {
    const container = document.getElementById("lista-carrinho");
    if (!container) return;

    container.innerHTML = "";

    if (itens.length === 0) {
      container.innerHTML = "<p>Carrinho vazio.</p>";
      return;
    }

    itens.forEach(item => {
      const { produto, quantidade } = item;

      const div = document.createElement("div");
      div.classList.add("item-carrinho");

      div.innerHTML = `
        <h4>${produto.nome}</h4>
        <p>Preço unitário: R$ ${produto.preco.toFixed(2)}</p>

        <div class="controle-qtd">
          <button 
            data-action="diminuir" 
            data-id="${produto.id}">
            −
          </button>

          <span>${quantidade}</span>

          <button 
            data-action="aumentar" 
            data-id="${produto.id}">
            +
          </button>
        </div>

        <p class="subtotal">
          Subtotal: R$ ${(produto.preco * quantidade).toFixed(2)}
        </p>
      `;

      container.appendChild(div);
    });
  }

  // ================= RESUMO =================
  static renderizarResumo(itens = []) {
    const totalSpan = document.getElementById("total-carrinho");
    if (!totalSpan) return;

    const total = itens.reduce(
      (soma, item) =>
        soma + item.produto.preco * item.quantidade,
      0
    );

    totalSpan.innerText = `R$ ${total.toFixed(2)}`;
  }

  // ================= FEEDBACK =================
  static mostrarFeedback(mensagem, tipo = "sucesso") {
    const feedback = document.createElement("div");
    feedback.className = `feedback ${tipo}`;
    feedback.innerText = mensagem;

    document.body.appendChild(feedback);

    setTimeout(() => feedback.remove(), 2500);
  }
}
