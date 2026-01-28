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