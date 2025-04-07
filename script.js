// script.js
import { database, ref, onValue, set } from './firebase-init.js';

// Verifica se as funções do Firebase estão disponíveis
if (!ref || !onValue || !set || !database) {
  console.error("Erro: Funções do Firebase não estão disponíveis. Verifique se o Firebase foi inicializado corretamente.");
  document.getElementById('passeios-lista').innerHTML = '<p>Erro ao carregar o Firebase. Verifique sua conexão com a internet e tente novamente.</p>';
} else {
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
    // passeio1: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406210.005802BR5913Liziane Lodea6007ERECHIM62100506BigBen6304B909", // Big Ben
    // passeio2: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406220.005802BR5913Liziane Lodea6007ERECHIM62130509londoneye63040B2E", // London Eye
    // passeio3: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406150.005802BR5913Liziane Lodea6007ERECHIM62130509londoneye6304F170", // Palácio de Westminster
    // passeio4: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406162.005802BR5913Liziane Lodea6007ERECHIM62210517abadiawestminster63042099", // Abadia de Westminster
    // passeio5: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406140.005802BR5913Liziane Lodea6007ERECHIM62180514pontedelondres6304F41C",  // Ponte de Londres
    // passeio6: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406216.005802BR5913Liziane Lodea6007ERECHIM62180514torredelondres6304DADC", // Torre de Londres
    // passeio7: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406170.005802BR5913Liziane Lodea6007ERECHIM62230519palaciodekensington630484C3", // Palácio de Kensington
    // passeio8: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406180.005802BR5913Liziane Lodea6007ERECHIM62170513casaannefrank6304A572", // Casa de Anne Frank
    // passeio9: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406198.005802BR5913Liziane Lodea6007ERECHIM62160512museuvangogh6304CB22", // Museu Van Gogh
    // passeio10: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406175.005802BR5913Liziane Lodea6007ERECHIM62120508heineken6304C1B1", // Heineken Experience
    // passeio11: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406265.005802BR5913Liziane Lodea6007Erechim62220518grandplacebruxelas63046F3E",// Grand Place de Bruxelas
    // passeio12: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406370.005802BR5913Liziane Lodea6007Erechim62150511torreeiffel6304D882",// Torre Eiffel
    // passeio14: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406192.005802BR5913Liziane Lodea6007Erechim62170513museudolouvre63046A2D",// Museu do Louvre
    // passeio15: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406151.005802BR5913Liziane Lodea6007Erechim62220518palaciodeversalhes630400B6",// Palácio de Versalhes
    // passeio16: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406122.005802BR5913Liziane Lodea6007Erechim62110507riosena63047175",// Rio Sena
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
// Nomes formatados dos passeios
  const nomesFormatados = {
    bigben: "Visitação ao Palácio de Westminster e Big Ben",
    londoneye: "Passeio na London Eye",
    abadiawestminster: "Visitação na Abadia de Westminster",
    palaciofortaleza: "Tour pela Torre de Londres e joias da coroa.",
    casaannefrank: "Visitação à Casa de Anne Frank",
    museuvangogh: "Visitação ao Museu Van Gogh",
    heinekenexp: "Heineken Experience",
    torreeiffel: "Um piquenique no jardim da Torre Eiffel",
    louvre: "Visitação ao Museu do Louvre",
    palacioversalhes: "Visitação ao Palácio e Jardim de Versalhes",
    riosena: "Cruzeiro noturno com aperitivos no Bateaux Mouches pelo Rio Sena",
    chaingles: "Um chá da tarde inglês",
    passeiobarcoamsterdam: "Passeio de barco com degustação de queijos e vinhos pelos canais de Amsterdam",
    excursaoganteeantuerpia: "Excursão guiada por Gante e Antuérpia",
    happyhour: "Happy Hour no Delirium Bar",
    cafeparis: "Cafezinho nas ruas de Paris.",
    };

  // Descrições dos passeios
// Descrições dos passeios
const descricoesPasseios = {
  bigben: "Visitação ao Palácio de Westminster e Big Ben, o palácio é a sede do governo britânico e tem instalado na torre noroeste o sino mais famoso do mundo, conhecido como Big Ben. ",
  londoneye: "Passeio na London Eye, 'Olho de Londres', é uma roda-gigante de observação que oferece vistas panorâmicas da cidade de Londres, com 135 metros de altura. É um dos pontos turísticos mais disputados da cidade.",
  abadiawestminster: "Visitação na Abadia de Westminster é uma grande igreja em arquitetura predominantemente gótica na cidade de Westminster, Londres, Inglaterra. É um dos edifícios religiosos mais notáveis do Reino Unido e o local tradicional de coroação e sepultamento dos monarcas ingleses.",
  palaciofortaleza: "Tour pela Torre de Londres e joias da coroa. O palácio e fortaleza real de Sua Majestade é um castelo histórico localizado na margem norte do rio Tâmisa. Foi fundado por volta do final do ano de 1066 depois da conquista normanda da Inglaterra.",
  casaannefrank: "Visitação à Casa de Anne Frank um museu biográfico localizado na cidade de Amsterdam. Anne Frank foi uma jovem judia alemã, vítima do Holocausto, que ficou conhecida mundialmente após a publicação póstuma de seu diário em 1947. ",
  museuvangogh: "Visitação ao Museu Van Gogh um museu de arte localizado no município de Amsterdam, na província de Holanda do Norte nos Países Baixos. O museu é responsável pela preservação, conservação e difusão da obra do pintor holandês Vincent van Gogh.",
  heinekenexp: "Heineken Experience - Um tour interativo que leva você pela história da renomada marca de cerveja, na sua fábrica mais antiga, localizada no coração de Amsterdã. Ao final do passeio, aproveite uma degustação de cerveja no topo da fábrica, em um terraço com uma vista deslumbrante da cidade.",
  torreeiffel: "Um piquenique no jardim da Torre Eiffel é uma experiência única, onde a magia de um dos monumentos mais emblemáticos do mundo se encontra com a tranquilidade do momento tendo a imponente Torre Eiffel como pano de fundo, é um cenário perfeito para relaxar e viver Paris de uma maneira íntima.",
  louvre: "Visitação ao Museu do Louvre é o maior museu de arte do mundo um dos museus mais famosos e visitados do mundo, localizado em Paris, na França. Hoje abriga uma vasta coleção que abrange milhares de anos de história, desde a civilização antiga até a arte contemporânea. ",
  palacioversalhes: "Visitação ao Palácio e Jardim de Versalhes é um dos mais magníficos e emblemáticos complexos arquitetônicos e paisagísticos da França. Os jardins de Versalhes são uma obra de arte por si só. Os jardins seguem o estilo clássico francês, com uma geometria perfeita, fontes, canais e grandes alamedas que se estendem por mais de 800 hectares.",
  riosena: "Cruzeiro noturno com aperitivos no Bateaux Mouches pelo Rio Sena que corta o coração da cidade de Paris e passa em meio a alguns dos mais populares pontos turísticos da capital francesa, entre eles a Torre Eiffel, o Museu do Louvre, o Museu d'Orsay e a Catedral de Notre-Dame.",
  chaingles: "Um chá da tarde inglês, o chá tradicional inglês é mais do que apenas uma bebida, é uma verdadeira instituição na cultura britânica. Tradicionalmente, o chá é servido entre as 15h e as 17h, acompanhado de uma seleção de sanduíches finos (geralmente de pepino, salmão defumado ou ovos e cress), scones com geleia e creme de leite, bolos e biscoitos.",
  passeiobarcoamsterdam: "Passeio de barco com degustação de queijos e vinhos pelos canais de Amsterdam, que é famosa por seus belos canais que cortam a cidade, proporcionando uma vista deslumbrante de suas históricas casas e pontes encantadoras.",
  excursaoganteeantuerpia: "Excursão guiada por Gante e Antuérpia, duas das mais belas cidades da Bélgica, num dia. Distinguem-se pelos canais, pelas ruas de paralelepípedos e pelas construções medievais.",
  happyhour: "Happy Hour no Delirium Bar, localizado perto da Grand Place de Bruxelas, é famoso por sua vasta seleção de mais de 2.000 tipos de cervejas de diferentes partes do mundo, incluindo muitas opções belgas. É um ótimo lugar para degustar uma variedade de cervejas.",
  cafeparis: "Cafezinho nas ruas de Paris. Nada mais chique do que tomar um café nas ruas de Paris. A cena é quase cinematográfica: você se senta em uma das charmosas mesinhas de ferro forjado de um café parisiense, com uma xícara fumegante de café espresso ou um capuccino perfeitamente preparado à sua frente.",

};

// URLs das imagens dos passeios
const imagensPasseios = {
  bigben: "images/palacioWestminsterEBigBen.png",
  londoneye: "images/londonEye.png",
  abadiawestminster: "images/abadiaDeWestminster.png",
  palaciofortaleza: "https://res.klook.com/image/upload/c_fill,w_750,h_563/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/jxf7zt9gnjou6unklfhd.jpg",
  casaannefrank: "images/casaAnneFrank.png",
  museuvangogh: "images/museuVanGogh.png",
  heinekenexp: "images/heinekenExp.png",
  torreeiffel: "images/torreEiffel.png",
  louvre: "images/museuLouvre.png",
  palacioversalhes: "images/palacioVersalhes.png",
  riosena: "images/CruzeiroRioSena.png",
  chaingles: "images/chaIngles.png",
  passeiobarcoamsterdam: "images/passeioBarcoAmsterdam.jpg",
  excursaoganteeantuerpia: "images/excursaoGanteEAntuerpia.png",
  happyhour: "images/happyHourDeliriumBar.jpg",
  cafeparis: "images/cafeParis.png",
};

  // Carrega os passeios do Firebase
// Carrega os passeios do Firebase
onValue(passeiosRef, (snapshot) => {
  console.log("Dados recebidos do Firebase:", snapshot.val());
  lista.innerHTML = '';

  const passeios = snapshot.val();
  if (!passeios || typeof passeios !== 'object') {
    console.error("Nenhum passeio encontrado ou dados inválidos:", passeios);
    lista.innerHTML = '<p>Erro ao carregar os passeios. Verifique sua conexão com a internet e tente novamente.</p>';
    return;
  }

  for (let id in passeios) {
    const passeio = passeios[id];
    if (!passeio || typeof passeio !== 'object') {
      console.error(`Passeio ${id} não é um objeto válido:`, passeio);
      continue;
    }

    const nomePasseio = Object.keys(passeio)[0]; // Ex.: "bigBen", "londonEye"
    if (!nomePasseio) {
      console.error(`Nome do passeio não encontrado para o ID ${id}:`, passeio);
      continue;
    }

    const dadosPasseio = passeio[nomePasseio];
    if (!dadosPasseio || typeof dadosPasseio !== 'object') {
      console.error(`Dados do passeio ${nomePasseio} não são um objeto válido:`, dadosPasseio);
      continue;
    }

    // Normaliza o nome do passeio para letras minúsculas para evitar problemas de capitalização
    const nomePasseioNormalizado = nomePasseio.toLowerCase();
    console.log(`Nome do passeio normalizado: ${nomePasseioNormalizado}`);

    const nomeFormatado = nomesFormatados[nomePasseioNormalizado] || nomePasseio;
    const descricao = descricoesPasseios[nomePasseioNormalizado] || "Descrição não disponível.";
    const imagem = imagensPasseios[nomePasseioNormalizado] || "https://via.placeholder.com/150";

    // Converte o valor para número, mesmo que venha como string
    const valor = dadosPasseio.valor != null ? Number(dadosPasseio.valor) : 0;
    console.log(`Valor do passeio ${nomePasseio}: ${valor}`);

    console.log("Passeio:", id, nomePasseio, dadosPasseio);

    // Define valores padrão para statusRondon  se não existirem
    const statusRondon = dadosPasseio.statusRondon || "disponivel";

    // Log para verificar os valores de status
    console.log(`Status Rondon para ${nomePasseio}:`, statusRondon);

    const div = document.createElement('div');
    div.classList.add('passeio');

    // Verifica se ambos os status são "pago" para aplicar a classe "pago"
    const isRondonPago = typeof statusRondon === 'string' && statusRondon.toLowerCase() === 'pago';
    if (isRondonPago) {
      div.classList.add('pago');
    }

    // Define as classes dos status com base nos valores
    const statusRondonClass = isRondonPago ? 'status-pago' : 'status-disponivel';

    div.innerHTML = `
    <h3>${nomeFormatado}</h3>
    <img src="${imagem}" alt="${nomeFormatado}" class="passeio-imagem">
    <p>${descricao}</p>
    <p>Valor: R$ ${valor.toFixed(2)}</p>
    <p class="status ${statusRondonClass}">Status para pagamento: ${statusRondon}</p>
    <button class="pagar-passeio" data-id="${id}" data-pessoa="Rondon" ${isRondonPago ? 'disabled' : ''}>
      Comprar Passeio para o Casal
    </button>
    `;
    lista.appendChild(div);
  }

  // Adiciona o evento de clique aos botões
  document.querySelectorAll('.pagar-passeio').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const pessoa = button.getAttribute('data-pessoa');
      selecionarPasseio(id, pessoa);
    });
  });
}, (error) => {
  console.error("Erro ao carregar os passeios do Firebase:", error);
  lista.innerHTML = '<p>Erro ao carregar os passeios. Verifique sua conexão com a internet e tente novamente.</p>';
});

  // Função para selecionar o passeio e exibir o modal
// Função para selecionar o passeio e exibir o modal
function selecionarPasseio(id, pessoa) {
  const passeioRef = ref(database, `passeios/${id}`);
  onValue(passeioRef, (snapshot) => {
    const passeio = snapshot.val();
    if (!passeio || typeof passeio !== 'object') {
      console.error(`Passeio ${id} não é um objeto válido:`, passeio);
      alert("Erro ao carregar o passeio. Tente novamente.");
      return;
    }

    const nomePasseio = Object.keys(passeio)[0]; // Ex.: "bigBen"
    if (!nomePasseio) {
      console.error(`Nome do passeio não encontrado para o ID ${id}:`, passeio);
      alert("Erro ao carregar o passeio. Tente novamente.");
      return;
    }

    const dadosPasseio = passeio[nomePasseio];
    if (!dadosPasseio || typeof dadosPasseio !== 'object') {
      console.error(`Dados do passeio ${nomePasseio} não são um objeto válido:`, dadosPasseio);
      alert("Erro ao carregar o passeio. Tente novamente.");
      return;
    }

    // Normaliza o nome do passeio para letras minúsculas
    const nomePasseioNormalizado = nomePasseio.toLowerCase();
    const nomeFormatado = nomesFormatados[nomePasseioNormalizado] || nomePasseio;
    const descricao = descricoesPasseios[nomePasseioNormalizado] || "Descrição não disponível.";
    const imagem = imagensPasseios[nomePasseioNormalizado] || "https://via.placeholder.com/150";
    const valor = dadosPasseio.valor != null ? Number(dadosPasseio.valor) : 0;

    // Define valores padrão para statusRondon se não existirem
    const statusRondon = dadosPasseio.statusRondon || "disponivel";

    // Log para depuração
    console.log(`Passeio ${id} (${nomeFormatado}) para ${pessoa}:`, dadosPasseio);

    // Normaliza o status da pessoa selecionada
    const statusKey = `status${pessoa}`; // "statusRondon" 
    const statusNormalizado = (dadosPasseio[statusKey] || "disponivel")
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '');

    if (statusNormalizado === 'disponivel') {
      // Preenche o modal com as informações
      modalTitle.textContent = `Pagar ${nomeFormatado} para ${pessoa}`;
      modalValue.textContent = `Valor: R$ ${valor.toFixed(2)} (insira este valor no app do banco)`;
      modalPixKey.textContent = pixKey;

      // Exibe o QR Code correspondente ao passeio
      if (qrCodesPasseios[id]) {
        modalQrCode.innerHTML = qrCodesPasseios[id];
      } else {
        modalQrCode.innerHTML = '<p>QR Code não disponível. Use a chave Pix acima para fazer o pagamento manualmente.</p>';
      }

      // Habilita o botão de confirmação e adiciona o evento de clique
      confirmarPagamentoBtn.disabled = false;
      confirmarPagamentoBtn.onclick = () => {
        // Atualiza o status da pessoa selecionada no Firebase
        const passeioPath = `passeios/${id}/${nomePasseio}`;
        const updatedData = {
          valor: dadosPasseio.valor,
          statusRondon: statusRondon,
        };
        updatedData[statusKey] = "pago"; // Atualiza apenas o status da pessoa selecionada

        set(ref(database, passeioPath), updatedData)
          .then(() => {
            console.log(`Status do passeio ${id} (${nomeFormatado}) para ${pessoa} atualizado para 'pago'`);
            alert(`Pagamento do ${nomeFormatado} para ${pessoa} confirmado com sucesso!`);
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
      alert(`Este passeio já foi pago para ${pessoa}!`);
      confirmarPagamentoBtn.disabled = true; // Desabilita o botão se o passeio já foi pago para essa pessoa
    }
  }, (error) => {
    console.error(`Erro ao carregar o passeio ${id}:`, error);
    alert("Erro ao carregar o passeio. Verifique sua conexão com a internet e tente novamente.");
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
}