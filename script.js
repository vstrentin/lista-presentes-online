import { ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Usa o database que foi definido globalmente no index.html
const database = window.database;
const passeiosRef = ref(database, 'passeios');
const lista = document.getElementById('passeios-lista');

// Configurações do Pix
const pixKey = "+5554996444841"; // Chave Pix atualizada (telefone)
const merchantName = "Liziane Lodea"; // Nome do beneficiário atualizado

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

// Payloads Pix para todos os passeios
const payloadsPasseios = {
  passeio1: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406210.005802BR5913Liziane Lodea6007ERECHIM62100506BigBen6304B909", // Big Ben
  passeio2: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406220.005802BR5913Liziane Lodea6007ERECHIM62130509londoneye63040B2E", // London Eye
  passeio3: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406150.005802BR5913Liziane Lodea6007ERECHIM62130509londoneye6304F170", // Palácio de Westminster
  passeio4: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406162.005802BR5913Liziane Lodea6007ERECHIM62210517abadiawestminster63042099", // Abadia de Westminster
  passeio5: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406140.005802BR5913Liziane Lodea6007ERECHIM62180514pontedelondres6304F41C", // Ponte de Londres
  passeio6: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406216.005802BR5913Liziane Lodea6007ERECHIM62180514torredelondres6304DADC", // Torre de Londres
  passeio7: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406170.005802BR5913Liziane Lodea6007ERECHIM62230519palaciodekensington630484C3", // Palácio de Kensington
  passeio8: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406180.005802BR5913Liziane Lodea6007ERECHIM62170513casaannefrank6304A572", // Casa de Anne Frank
  passeio9: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406198.005802BR5913Liziane Lodea6007ERECHIM62160512museuvangogh6304CB22", // Museu Van Gogh
  passeio10: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406175.005802BR5913Liziane Lodea6007ERECHIM62120508heineken6304C1B1" // Heineken Experience
};

// Gera os QR Codes para todos os passeios
const qrCodesPasseios = {};
for (let id in payloadsPasseios) {
  if (typeof qrcode === 'undefined') {
    console.error('Biblioteca qrcode-generator não foi carregada corretamente.');
    qrCodesPasseios[id] = '<p>Erro ao gerar o QR Code. Por favor, use a chave Pix manualmente.</p>';
  } else {
    const qr = qrcode(0, 'M');
    qr.addData(payloadsPasseios[id]);
    qr.make();
    qrCodesPasseios[id] = qr.createImgTag(6);
  }
}

// Nomes formatados dos passeios
const nomesFormatados = {
  bigBen: "Big Ben",
  londonEye: "London Eye",
  palacioWestminster: "Palácio de Westminster",
  abadiaWestminster: "Abadia de Westminster",
  ponteLondres: "Ponte de Londres",
  palacioFortaleza: "Palácio e Fortaleza Real da Torre de Londres",
  palacioKensington: "Palácio de Kensington",
  casaAnneFrank: "Casa de Anne Frank",
  museuVanGogh: "Museu Van Gogh",
  heinekenExp: "Heineken Experience"
};

// Descrições dos passeios
const descricoesPasseios = {
  bigBen: "Big Ben é o nome do sino mais famoso do mundo e da torre que o abriga, no Palácio de Westminster, em Londres. O Big Ben é um grande sino instalado na torre noroeste sede do Parlamento Britânico, localizado em Londres, no Reino Unido.",
  londonEye: "A London Eye, 'Olho de Londres', também conhecida como Millennium Wheel, é uma roda-gigante de observação, com 135 metros de altura. Situada na cidade de Londres, da Inglaterra, foi inaugurada na passagem entre o dia 31 de dezembro de 1999 e 1 de janeiro de 2000 e é um dos pontos turísticos mais disputados da cidade.",
  palacioWestminster: "O Palácio de Westminster, também conhecido como Casas do Parlamento, é o palácio londrino onde estão instaladas as duas Câmaras do Parlamento do Reino Unido. O palácio fica situado na margem Norte do rio Tâmisa, no Borough da Cidade de Westminster próximo de outros edifícios governamentais ao longo da Whitehall.",
  abadiaWestminster: "A Abadia de Westminster, formalmente denominada Igreja Colegiada de São Pedro em Westminster, é uma grande igreja em arquitetura predominantemente gótica na cidade de Westminster, Londres, Inglaterra, a oeste do Palácio de Westminster. ",
  ponteLondres: "A Ponte da Torre de Londres, Tower Bridge ou simplesmente Ponte da Torre, é uma ponte-báscula construída sobre o rio Tâmisa, na cidade de Londres, capital do Reino Unido. A ponte foi construída entre 1886 e 1894, projetada por Horace Jones, John Wolfe Barry e Henry Marc Brunel.",
  palacioFortaleza: "O Palácio e Fortaleza Real de Sua Majestade da Torre de Londres é um castelo histórico localizado na cidade de Londres, Inglaterra, Reino Unido, na margem norte do rio Tâmisa. Foi fundado por volta do final do ano de 1066 depois da conquista normanda da Inglaterra.",
  palacioKensington: "O Palácio de Kensington é uma residência real situada em Kensington Gardens, no Royal Borough de Kensington e Chelsea, em Londres, Inglaterra. Tem sido utilizado pela Família Real Britânica desde o século XVII.",
  casaAnneFrank: "A Casa de Anne Frank é um museu biográfico localizado na cidade de Amesterdã, capital dos Países Baixos.",
  museuVanGogh: "O Museu Van Gogh é um museu de arte localizado no município de Amsterdã, na província de Holanda do Norte nos Países Baixos. O museu é responsável pela preservação, conservação e difusão da obra do pintor holandês Vincent van Gogh.",
  heinekenExp: "Heineken Experience - Tour interativo pela história da grande empresa cervejeira em uma antiga fábrica com degustação no final. "
};

// URLs das imagens dos passeios (substitua pelas URLs reais)
const imagensPasseios = {
  bigBen: "https://static.historiadomundo.com.br/conteudo/images/o-famoso-sino-big-ben-foi-construido-no-seculo-xix-instalado-na-torre-relogio-em-londres-546cca5e27f55.jpg",
  londonEye: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/London-Eye-2009.JPG/800px-London-Eye-2009.JPG",
  palacioWestminster: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sala_Westminster%2C_Palacio_de_Westminster%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_015.JPG",
  abadiaWestminster: "https://londontickets.tours/wp-content/uploads/2023/01/westminster-abbey.jpg",
  ponteLondres: "https://i0.wp.com/gsilvosatrekpix.com/wp-content/uploads/2024/11/Girl-Dophin-Tower-Bridge-648.jpg?w=648&ssl=1",
  palacioFortaleza: "https://res.klook.com/image/upload/c_fill,w_750,h_563/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/jxf7zt9gnjou6unklfhd.jpg",
  palacioKensington: "https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_3:1,w_3840,g_auto/f_auto/q_auto/v1/gc-v1/london/604?_a=BAVAZGDX0",
  casaAnneFrank: "https://dicasdeamsterda.com.br/wp-content/uploads/sites/6/2016/04/annef-e1572036128309.jpg",
  museuVanGogh: "https://images.adsttc.com/media/images/55e6/f619/e58e/ce03/1300/0374/large_jpg/PORTADA_06_VanGoghMuseum_EntranceBuilding_HansvanHeeswijkArchitects_photo_RonaldTilleman.jpg?1441199623",
  heinekenExp: "https://cdn.thatch.co/cdn-cgi/image/width=3840,format=webp/images/104109/6ga2u9.png"
};

// Carrega os passeios do Firebase
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
    const nomePasseio = Object.keys(passeio)[0]; // Ex.: "bigBen", "londonEye"
    const dadosPasseio = passeio[nomePasseio]; // Ex.: { status: "disponivel", valor: 210 }
    const nomeFormatado = nomesFormatados[nomePasseio] || nomePasseio;
    const descricao = descricoesPasseios[nomePasseio] || "Descrição não disponível.";
    const imagem = imagensPasseios[nomePasseio] || "https://via.placeholder.com/150"; // Imagem padrão se não houver

    console.log("Passeio:", id, nomePasseio, dadosPasseio);
    const div = document.createElement('div');
    div.classList.add('passeio');
    if (dadosPasseio.status.toLowerCase() === 'pago') div.classList.add('pago');

    // Define a classe do status com base no valor
    const statusClass = dadosPasseio.status.toLowerCase() === 'disponivel' ? 'status-disponivel' : 'status-pago';
    
    div.innerHTML = `
      <h3>${nomeFormatado}</h3>
      <img src="${imagem}" alt="${nomeFormatado}" class="passeio-imagem">
      <p>${descricao}</p>
      <p>Valor: R$ ${parseFloat(dadosPasseio.valor).toFixed(2)}</p>
      <p class="status ${statusClass}">Status: ${dadosPasseio.status}</p>
      <button class="pagar-passeio" data-id="${id}" ${dadosPasseio.status.toLowerCase() === 'pago' ? 'disabled' : ''}>
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
    const nomePasseio = Object.keys(passeio)[0]; // Ex.: "bigBen"
    const dadosPasseio = passeio[nomePasseio]; // Ex.: { status: "disponivel", valor: 210 }
    const nomeFormatado = nomesFormatados[nomePasseio] || nomePasseio;
    const descricao = descricoesPasseios[nomePasseio] || "Descrição não disponível.";
    const imagem = imagensPasseios[nomePasseio] || "https://via.placeholder.com/150"; // Imagem padrão se não houver

    // Log para depuração
    console.log(`Passeio ${id} (${nomeFormatado}):`, dadosPasseio);

    // Normaliza o status removendo acentos e espaços
    const statusNormalizado = dadosPasseio.status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '');

    if (statusNormalizado === 'disponivel') {
      // Preenche o modal com as informações
      modalTitle.textContent = `Pagar ${nomeFormatado}`;
      modalValue.textContent = `Valor: R$ ${parseFloat(dadosPasseio.valor).toFixed(2)} (insira este valor no app do banco)`;
      modalPixKey.textContent = pixKey;
      modalDescription.textContent = descricao;
      modalImage.src = imagem;
      modalImage.alt = nomeFormatado;

      // Exibe o QR Code correspondente ao passeio
      if (qrCodesPasseios[id]) {
        modalQrCode.innerHTML = qrCodesPasseios[id];
      } else {
        modalQrCode.innerHTML = '<p>QR Code não disponível. Use a chave Pix acima para fazer o pagamento manualmente.</p>';
      }

      // Habilita o botão de confirmação e adiciona o evento de clique
      confirmarPagamentoBtn.disabled = false;
      confirmarPagamentoBtn.onclick = () => {
        // Atualiza o status no Firebase
        const passeioPath = `passeios/${id}/${nomePasseio}`;
        set(ref(database, passeioPath), {
          status: "pago",
          valor: dadosPasseio.valor
        })
          .then(() => {
            console.log(`Status do passeio ${id} (${nomeFormatado}) atualizado para 'pago'`);
            alert(`Pagamento do ${nomeFormatado} confirmado com sucesso!`);
            modal.style.display = 'none'; // Fecha o modal
            // A interface será atualizada automaticamente pelo onValue
          })
          .catch((error) => {
            console.error("Erro ao atualizar o status no Firebase:", error);
            alert("Erro ao confirmar o pagamento. Tente novamente.");
          });
      };

      // Exibe o modal
      modal.style.display = 'block';
    } else {
      alert('Este passeio já foi pago!');
      confirmarPagamentoBtn.disabled = true; // Desabilita o botão se o passeio já foi pago
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