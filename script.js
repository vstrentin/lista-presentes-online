import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Usa o database que foi definido globalmente no index.html
const database = window.database;
const passeiosRef = ref(database, 'passeios');
const lista = document.getElementById('passeios-lista');

// Configurações do Pix (substitua pelos valores reais)
const pixKey = "noivos@example.com"; // Substitua pela chave Pix real dos noivos
const merchantName = "Noivos Casamento"; // Nome dos noivos (até 25 caracteres)

// Elementos do modal
const modal = document.getElementById('pix-modal');
const modalTitle = document.getElementById('modal-title');
const modalValue = document.getElementById('modal-value');
const modalPixKey = document.getElementById('modal-pix-key');
const modalQrCode = document.getElementById('modal-qr-code');
const closeModal = document.getElementById('close-modal');

// Carrega os passeios do Firebase
onValue(passeiosRef, (snapshot) => {
  console.log("Dados recebidos do Firebase:", snapshot.val());
  lista.innerHTML = '';
  const passeios = snapshot.val();
  if (!passeios) {
    console.log("Nenhum passeio encontrado no nó 'passeios'.");
    lista.innerHTML = '<p>Nenhum passeio disponível no momento.</p>';
    return;
  }
  for (let id in passeios) {
    const passeio = passeios[id];
    console.log("Passeio:", id, passeio);
    const div = document.createElement('div');
    div.classList.add('passeio');
    if (passeio.status === 'pago') div.classList.add('pago');
    
    div.innerHTML = `
      <h3>${passeio.nome}</h3>
      <p>Valor: R$ ${parseFloat(passeio.valor).toFixed(2)}</p>
      <p>Status: ${passeio.status}</p>
      <button class="pagar-passeio" data-id="${id}" ${passeio.status === 'pago' ? 'disabled' : ''}>
        Pagar Passeio
      </button>
    `;
    lista.appendChild(div);
  }

  // Adiciona o evento de clique aos botões
  document.querySelectorAll('.pagar-passeio').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      selecionarPasseio(id);
    });
  });
});

// Função para selecionar o passeio e exibir o modal
function selecionarPasseio(id) {
  const passeioRef = ref(database, `passeios/${id}`);
  onValue(passeioRef, (snapshot) => {
    const passeio = snapshot.val();
    if (passeio.status.toLowerCase() === 'disponível') {
      // Preenche o modal com as informações
      modalTitle.textContent = `Pagar ${passeio.nome}`;
      modalValue.textContent = `Valor: R$ ${parseFloat(passeio.valor).toFixed(2)}`;
      modalPixKey.textContent = pixKey;

      // Gera o Payload Pix com o valor do passeio
      const payload = generatePixPayload({
        pixKey: pixKey,
        amount: parseFloat(passeio.valor),
        merchantName: merchantName,
        transactionId: `PASSEIO-${id}`
      });

      // Limpa o conteúdo anterior do QR Code
      modalQrCode.innerHTML = '';

      // Verifica se a biblioteca qrcode-generator está disponível
      if (typeof qrcode === 'undefined') {
        console.error('Biblioteca qrcode-generator não foi carregada corretamente.');
        modalQrCode.innerHTML = '<p>Erro ao gerar o QR Code. Por favor, use a chave Pix manualmente.</p>';
      } else {
        // Gera o QR Code com o Payload Pix usando qrcode-generator
        const qr = qrcode(0, 'H'); // 0 = tipo automático, 'H' = nível de correção alto
        qr.addData(payload);
        qr.make();
        modalQrCode.innerHTML = qr.createImgTag(4); // Gera uma imagem com escala 4
      }

      // Exibe o modal
      modal.style.display = 'block';
    } else {
      alert('Este passeio já foi pago!');
    }
  }, { onlyOnce: true });
}

// Fecha o modal ao clicar no botão de fechar
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fecha o modal ao clicar fora dele
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Função para gerar o Payload Pix
function generatePixPayload({ pixKey, amount, merchantName, transactionId }) {
  const formatField = (id, value) => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const payloadFormat = formatField('00', '01');
  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', pixKey);
  const merchantAccountInfo = formatField('26', `${gui}${key}`);
  const merchantCategoryCode = formatField('52', '0000');
  const currency = formatField('53', '986');
  const formattedAmount = amount.toFixed(2);
  const amountField = formatField('54', formattedAmount);
  const countryCode = formatField('58', 'BR');
  const merchantNameField = formatField('59', merchantName);
  const merchantCity = formatField('60', 'SAO PAULO');
  const additionalData = formatField('05', transactionId);
  const additionalDataField = formatField('62', additionalData);
  const crc16Field = '6304';

  let payload = `${payloadFormat}${merchantAccountInfo}${merchantCategoryCode}${currency}${amountField}${countryCode}${merchantNameField}${merchantCity}${additionalDataField}${crc16Field}`;
  const crc16 = calculateCRC16(payload).toString(16).toUpperCase().padStart(4, '0');
  payload = payload.slice(0, -4) + crc16;

  return payload;
}

// Função para calcular o CRC16
function calculateCRC16(payload) {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc;
}