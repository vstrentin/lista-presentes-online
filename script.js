// script.js
import { database, ref, onValue, set } from './firebase-init.js';

// Verifica se as funções do Firebase estão disponíveis
if (!ref || !onValue || !set || !database) {
  console.error("Erro: Funções do Firebase não estão disponíveis.");
  document.getElementById('passeios-lista').innerHTML = '<p>Erro ao carregar o Firebase.</p>';
} else {
  const passeiosRef = ref(database, 'passeios');
  const lista = document.getElementById('passeios-lista');

  // Elementos do modal
  const modal = document.getElementById('pix-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalValue = document.getElementById('modal-value');
  const modalPixKey = document.getElementById('modal-pix-key');
  const modalQrCode = document.getElementById('modal-qr-code');
  const modalDescription = document.getElementById('modal-description');
  const modalImage = document.getElementById('modal-image');
  const closeModal = document.getElementById('close-modal');
  const confirmarPagamentoBtn = document.getElementById('confirmar-pagamento');

  // Nomes formatados, descrições e imagens (mantidos iguais ao seu código original)
  const nomesFormatados = {
    bigben: "Visitação ao Palácio de Westminster e Big Ben",
    londoneye: "Passeio na London Eye",
    // ... (mantenha todos os outros)
  };

  const descricoesPasseios = {
    bigben: "Visitação ao Palácio de Westminster e Big Ben...",
    londoneye: "Passeio na London Eye...",
    // ... (mantenha todos os outros)
  };

  const imagensPasseios = {
    bigben: "images/palacioWestminsterEBigBen.png",
    londoneye: "images/londonEye.png",
    // ... (mantenha todos os outros)
  };

  // Carrega os passeios do Firebase
  onValue(passeiosRef, (snapshot) => {
    lista.innerHTML = '';
    const passeios = snapshot.val();
    if (!passeios || typeof passeios !== 'object') {
      lista.innerHTML = '<p>Erro ao carregar os passeios.</p>';
      return;
    }

    for (let id in passeios) {
      const passeio = passeios[id];
      const nomePasseio = Object.keys(passeio)[0];
      const dadosPasseio = passeio[nomePasseio];
      const nomePasseioNormalizado = nomePasseio.toLowerCase();

      const nomeFormatado = nomesFormatados[nomePasseioNormalizado] || nomePasseio;
      const descricao = descricoesPasseios[nomePasseioNormalizado] || "Descrição não disponível.";
      const imagem = imagensPasseios[nomePasseioNormalizado] || "https://via.placeholder.com/150";
      const valor = Number(dadosPasseio.valor) || 0;
      const statusRondon = dadosPasseio.statusRondon || "disponivel";

      const isRondonPago = statusRondon.toLowerCase() === 'pago';
      const statusRondonClass = isRondonPago ? 'status-pago' : 'status-disponivel';

      const div = document.createElement('div');
      div.classList.add('passeio');
      if (isRondonPago) div.classList.add('pago');

      div.innerHTML = `
        <h3>${nomeFormatado}</h3>
        <img src="${imagem}" alt="${nomeFormatado}" class="passeio-imagem">
        <p>${descricao}</p>
        <p>Valor: R$ ${valor.toFixed(2)}</p>
        <p class="status ${statusRondonClass}">Status: ${statusRondon}</p>
        <button class="pagar-passeio" data-id="${id}" data-pessoa="Rondon" ${isRondonPago ? 'disabled' : ''}>
          Comprar Passeio para o Casal
        </button>
      `;
      lista.appendChild(div);
    }

    document.querySelectorAll('.pagar-passeio').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const pessoa = button.getAttribute('data-pessoa');
        selecionarPasseio(id, pessoa);
      });
    });
  }, (error) => {
    console.error("Erro ao carregar os passeios:", error);
    lista.innerHTML = '<p>Erro ao carregar os passeios.</p>';
  });

  // Função para criar pagamento Pix via backend
  async function criarPagamentoMercadoPago(valor, descricao, idPasseio) {
    try {
      const response = await fetch('http://localhost:3000/criar-pagamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor,
          descricao,
          idPasseio,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  }

  // Função para selecionar o passeio e exibir o modal
  async function selecionarPasseio(id, pessoa) {
    const passeioRef = ref(database, `passeios/${id}`);
    onValue(passeioRef, async (snapshot) => {
      const passeio = snapshot.val();
      const nomePasseio = Object.keys(passeio)[0];
      const dadosPasseio = passeio[nomePasseio];
      const nomePasseioNormalizado = nomePasseio.toLowerCase();

      const nomeFormatado = nomesFormatados[nomePasseioNormalizado] || nomePasseio;
      const descricao = descricoesPasseios[nomePasseioNormalizado] || "Descrição não disponível.";
      const imagem = imagensPasseios[nomePasseioNormalizado] || "https://via.placeholder.com/150";
      const valor = Number(dadosPasseio.valor) || 0;
      const statusKey = `status${pessoa}`;
      const statusNormalizado = (dadosPasseio[statusKey] || "disponivel").toLowerCase();

      if (statusNormalizado === 'disponivel') {
        try {
          // Cria o pagamento via backend
          const pagamento = await criarPagamentoMercadoPago(valor, nomeFormatado, id);
          if (!pagamento || !pagamento.point_of_interaction) {
            alert("Erro ao criar o pagamento. Tente novamente.");
            return;
          }

          // Preenche o modal
          modalTitle.textContent = `Pagar ${nomeFormatado} para o Casal`;
          modalValue.textContent = `Valor: R$ ${valor.toFixed(2)}`;
          modalPixKey.textContent = pagamento.point_of_interaction.transaction_data.qr_code; // Chave Pix (copia e cola)
          modalQrCode.innerHTML = `<img src="data:image/png;base64,${pagamento.point_of_interaction.transaction_data.qr_code_base64}" alt="QR Code Pix">`;
          modalDescription.textContent = descricao;
          modalImage.src = imagem;

          // Habilita o botão de confirmação
          confirmarPagamentoBtn.disabled = false;
          confirmarPagamentoBtn.onclick = () => {
            const passeioPath = `passeios/${id}/${nomePasseio}`;
            const updatedData = {
              valor: dadosPasseio.valor,
              statusRondon: dadosPasseio.statusRondon || "disponivel",
              paymentId: pagamento.id, // Armazena o ID do pagamento
            };
            updatedData[statusKey] = "pago";

            set(ref(database, passeioPath), updatedData)
              .then(() => {
                alert(`Pagamento do ${nomeFormatado} confirmado com sucesso!`);
                modal.style.display = 'none';
              })
              .catch((error) => {
                console.error("Erro ao atualizar o status:", error);
                alert("Erro ao confirmar o pagamento.");
              });
          };

          modal.style.display = 'block';
        } catch (error) {
          alert("Erro ao criar o pagamento. Verifique se o backend está rodando e tente novamente.");
        }
      } else {
        alert(`Este passeio já foi pago para ${pessoa}!`);
        confirmarPagamentoBtn.disabled = true;
      }
    }, { onlyOnce: true });
  }

  // Fecha o modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}