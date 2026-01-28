export class UIService {

  // ================= PRODUTOS =================
  static renderizarProdutos(produtos = []) { // proteção
    const container = document.getElementById("lista-produtos");
    if (!container) return;

    container.innerHTML = "";

    if (produtos.length === 0) {
      lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    produtos.forEach(produto => {
      const card = document.createElement("div");
      card.classList.add("produto-card");

      // ---- FEEDBACK VISUAL DE ESTOQUE ----
      let classeEstoque = "estoque";
      let textoEstoque = produto.estoque != null
      ? `Estoque: ${produto.estoque}`
      : "Estoque disponível";


      if (produto.estoque === 0) {
        classeEstoque += " estoque-esgotado";
        textoEstoque = "Sem estoque";
      } else if (produto.estoque <= 2) {
        classeEstoque += " estoque-baixo";
      }

      const estoque = produto.estoque ?? Infinity;

      const botaoCarrinhoDesabilitado =
      estoque === 0 ? "disabled" : "";

      card.innerHTML = `
        <h3>${produto.nome}</h3>Finalizar
        <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
        <p class="${classeEstoque}">${textoEstoque}</p>

        <div class="acoes">
          <button data-action="editar" data-id="${produto.id}">
            Editar
          </button>

          <button data-action="excluir" data-id="${produto.id}">
            Excluir
          </button>

          <button 
            data-action="carrinho" 
            data-id="${produto.id}"
            ${botaoCarrinhoDesabilitado}>
            Adicionar ao Carrinho
          </button>
        </div>
      `;

      lista.appendChild(item);
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
      const div = document.createElement("div");
      div.classList.add("item-carrinho");

      const btnMaisDisabled =
        item.quantidade >= item.estoque ? "disabled" : "";

      const btnMenosDisabled =
        item.quantidade <= 1 ? "disabled" : "";

      div.innerHTML = `
        <h4>${item.nome}</h4>
        <p>R$ ${item.preco.toFixed(2)}</p>

        <div class="controle-qtd">
          <button 
            data-action="diminuir" 
            data-id="${item.id}"
            ${btnMenosDisabled}>
            −
          </button>

          <span>${item.quantidade}</span>

          <button 
            data-action="aumentar" 
            data-id="${item.id}"
            ${btnMaisDisabled}>
            +
          </button>
        </div>

        <p class="subtotal">
          Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}
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
      (soma, item) => soma + item.preco * item.quantidade,
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
