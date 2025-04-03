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
    passeio1: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406210.005802BR5913Liziane Lodea6007ERECHIM62100506BigBen6304B909", // Big Ben
    passeio2: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406220.005802BR5913Liziane Lodea6007ERECHIM62130509londoneye63040B2E", // London Eye
    passeio3: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406150.005802BR5913Liziane Lodea6007ERECHIM62130509londoneye6304F170", // Palácio de Westminster
    passeio4: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406162.005802BR5913Liziane Lodea6007ERECHIM62210517abadiawestminster63042099", // Abadia de Westminster
    passeio5: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406140.005802BR5913Liziane Lodea6007ERECHIM62180514pontedelondres6304F41C",  // Ponte de Londres
    passeio6: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406216.005802BR5913Liziane Lodea6007ERECHIM62180514torredelondres6304DADC", // Torre de Londres
    passeio7: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406170.005802BR5913Liziane Lodea6007ERECHIM62230519palaciodekensington630484C3", // Palácio de Kensington
    passeio8: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406180.005802BR5913Liziane Lodea6007ERECHIM62170513casaannefrank6304A572", // Casa de Anne Frank
    passeio9: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406198.005802BR5913Liziane Lodea6007ERECHIM62160512museuvangogh6304CB22", // Museu Van Gogh
    passeio10: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406175.005802BR5913Liziane Lodea6007ERECHIM62120508heineken6304C1B1", // Heineken Experience
    passeio11: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406265.005802BR5913Liziane Lodea6007Erechim62220518grandplacebruxelas63046F3E",// Grand Place de Bruxelas
    passeio12: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406370.005802BR5913Liziane Lodea6007Erechim62150511torreeiffel6304D882",// Torre Eiffel
    passeio13: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406170.005802BR5913Liziane Lodea6007Erechim62180514parquebruxelas6304035D",// Parque de Bruxelas
    passeio14: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406192.005802BR5913Liziane Lodea6007Erechim62170513museudolouvre63046A2D",// Museu do Louvre
    passeio15: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406151.005802BR5913Liziane Lodea6007Erechim62220518palaciodeversalhes630400B6",// Palácio de Versalhes
    passeio16: "00020126360014BR.GOV.BCB.PIX0114+55549964448415204000053039865406122.005802BR5913Liziane Lodea6007Erechim62110507riosena63047175",// Rio Sena
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
    bigben: "Big Ben",
    londoneye: "London Eye",
    palaciowestminster: "Palácio de Westminster",
    abadiawestminster: "Abadia de Westminster",
    pontelondres: "Ponte de Londres",
    palaciofortaleza: "Palácio e Fortaleza Real da Torre de Londres",
    palaciokensington: "Palácio de Kensington",
    casaannefrank: "Casa de Anne Frank",
    museuvangogh: "Museu Van Gogh",
    heinekenexp: "Heineken Experience",
    grandplacebruxelas: "Grand Place de Bruxelas",
    torreeiffel: "Torre Eiffel",
    parquebruxelas: "Parque de Bruxelas",
    louvre: "Museu do Louvre",
    palacioversalhes: "Palácio de Versalhes",
    riosena: "Rio Sena",
    };

  // Descrições dos passeios
// Descrições dos passeios
const descricoesPasseios = {
  bigben: "Big Ben é o nome do sino mais famoso do mundo e da torre que o abriga, no Palácio de Westminster, em Londres. O Big Ben é um grande sino instalado na torre noroeste sede do Parlamento Britânico, localizado em Londres, no Reino Unido.",
  londoneye: "A London Eye, 'Olho de Londres', também conhecida como Millennium Wheel, é uma roda-gigante de observação, com 135 metros de altura. Situada na cidade de Londres, da Inglaterra, foi inaugurada na passagem entre o dia 31 de dezembro de 1999 e 1 de janeiro de 2000 e é um dos pontos turísticos mais disputados da cidade.",
  palaciowestminster: "O Palácio de Westminster, também conhecido como Casas do Parlamento, é o palácio londrino onde estão instaladas as duas Câmaras do Parlamento do Reino Unido. O palácio fica situado na margem Norte do rio Tâmisa, no Borough da Cidade de Westminster próximo de outros edifícios governamentais ao longo da Whitehall.",
  abadiawestminster: "A Abadia de Westminster, formalmente denominada Igreja Colegiada de São Pedro em Westminster, é uma grande igreja em arquitetura predominantemente gótica na cidade de Westminster, Londres, Inglaterra, a oeste do Palácio de Westminster.",
  pontelondres: "A Ponte da Torre de Londres, Tower Bridge ou simplesmente Ponte da Torre, é uma ponte-báscula construída sobre o rio Tâmisa, na cidade de Londres, capital do Reino Unido. A ponte foi construída entre 1886 e 1894, projetada por Horace Jones, John Wolfe Barry e Henry Marc Brunel.",
  palaciofortaleza: "O Palácio e Fortaleza Real de Sua Majestade da Torre de Londres é um castelo histórico localizado na cidade de Londres, Inglaterra, Reino Unido, na margem norte do rio Tâmisa. Foi fundado por volta do final do ano de 1066 depois da conquista normanda da Inglaterra.",
  palaciokensington: "O Palácio de Kensington é uma residência real situada em Kensington Gardens, no Royal Borough de Kensington e Chelsea, em Londres, Inglaterra. Tem sido utilizado pela Família Real Britânica desde o século XVII.",
  casaannefrank: "A Casa de Anne Frank é um museu biográfico localizado na cidade de Amesterdã, capital dos Países Baixos.",
  museuvangogh: "O Museu Van Gogh é um museu de arte localizado no município de Amsterdã, na província de Holanda do Norte nos Países Baixos. O museu é responsável pela preservação, conservação e difusão da obra do pintor holandês Vincent van Gogh.",
  heinekenexp: "Heineken Experience - Tour interativo pela história da grande empresa cervejeira em uma antiga fábrica com degustação no final.",
  grandplacebruxelas: "A Grand-Place de Bruxelas é a praça central de Bruxelas. Nela ficam a Câmara Municipal e a Casa do Rei. Alguns autores, entre os quais Victor Hugo, consideram-na a mais bela praça do mundo. Passeio com guia local.",
  torreeiffel: "A Torre Eiffel é uma torre treliçada de ferro forjado no Champ de Mars, em Paris, França. Tem o nome do engenheiro Gustave Eiffel, cuja empresa projetou e construiu a torre de 1887 a 1889. Passeio com degustação. ",
  parquebruxelas: "Também conhecido como Parque Real, o Parque de Bruxelas é o Parque de Bruxelas! Antigo refúgio de caça da realeza, é para lá que vão muitos dos habitantes quando querem relaxar e espairecer. Nos finais de semana fica lotado, pois muitos o procuram para praticar esportes, descansar, conversar e beber cerveja. Passeio com piquenique. ",
  louvre: "Louvre ou Museu do Louvre é o maior museu de arte do mundo e um monumento histórico em Paris, França. Um marco central da cidade, está localizado na margem direita do rio Sena, no 1º arrondissement da cidade.",
  palacioversalhes: "Palácio de Versalhes é um castelo real localizado na cidade de Versalhes, uma aldeia rural à época de sua construção, mas atualmente um subúrbio de Paris.",
  riosena: "O Rio Sena corta o coração da cidade de Paris e passa em meio a alguns dos mais populares pontos turísticos da capital francesa, entre eles a Torre Eiffel, o Museu do Louvre, o Museu d'Orsay e a Catedral de Notre-Dame",
};

// URLs das imagens dos passeios
const imagensPasseios = {
  bigben: "https://static.historiadomundo.com.br/conteudo/images/o-famoso-sino-big-ben-foi-construido-no-seculo-xix-instalado-na-torre-relogio-em-londres-546cca5e27f55.jpg",
  londoneye: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/London-Eye-2009.JPG/800px-London-Eye-2009.JPG",
  palaciowestminster: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sala_Westminster%2C_Palacio_de_Westminster%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_015.JPG",
  abadiawestminster: "https://londontickets.tours/wp-content/uploads/2023/01/westminster-abbey.jpg",
  pontelondres: "https://i0.wp.com/gsilvosatrekpix.com/wp-content/uploads/2024/11/Girl-Dophin-Tower-Bridge-648.jpg?w=648&ssl=1",
  palaciofortaleza: "https://res.klook.com/image/upload/c_fill,w_750,h_563/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/jxf7zt9gnjou6unklfhd.jpg",
  palaciokensington: "https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_3:1,w_3840,g_auto/f_auto/q_auto/v1/gc-v1/london/604?_a=BAVAZGDX0",
  casaannefrank: "https://dicasdeamsterda.com.br/wp-content/uploads/sites/6/2016/04/annef-e1572036128309.jpg",
  museuvangogh: "https://images.adsttc.com/media/images/55e6/f619/e58e/ce03/1300/0374/large_jpg/PORTADA_06_VanGoghMuseum_EntranceBuilding_HansvanHeeswijkArchitects_photo_RonaldTilleman.jpg?1441199623",
  heinekenexp: "https://cdn.thatch.co/cdn-cgi/image/width=3840,format=webp/images/104109/6ga2u9.png",
  grandplacebruxelas: "https://viajantesemfim.com.br/wp-content/uploads/2019/12/76647936_2581328741986880_620154867649871872_o.jpg",
  torreeiffel: "https://cdn-imgix.headout.com/media/images/c90f7eb7a5825e6f5e57a5a62d05399c-25058-BestofParis-EiffelTower-Cruise-Louvre-002.jpg?auto=format&w=1051.2&h=540&q=90&fit=fit",
  parquebruxelas: "https://dicaseuropa.com.br/wp-content/uploads/2014/01/parque-cinquentenario-bruxelas.jpg",
  louvre: "https://www.simplesmenteparis.com/wp-content/uploads/2019/04/louvre-museum-1200x675.jpg",
  palacioversalhes: "https://images.adsttc.com/media/images/6176/f430/f91c/81be/2200/000c/medium_jpg/jeremy-bezanger-pb-xtneJAAk-unsplash.jpg?1635185691",
  riosena: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Pont_au_Change_and_Palais_de_justice%2C_Paris_20_April_2021_001.jpg/480px-Pont_au_Change_and_Palais_de_justice%2C_Paris_20_April_2021_001.jpg",
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

    // Define valores padrão para statusRondon e statusLiziane se não existirem
    const statusRondon = dadosPasseio.statusRondon || "disponivel";
    const statusLiziane = dadosPasseio.statusLiziane || "disponivel";

    // Log para verificar os valores de status
    console.log(`Status Rondon para ${nomePasseio}:`, statusRondon);
    console.log(`Status Liziane para ${nomePasseio}:`, statusLiziane);

    const div = document.createElement('div');
    div.classList.add('passeio');

    // Verifica se ambos os status são "pago" para aplicar a classe "pago"
    const isRondonPago = typeof statusRondon === 'string' && statusRondon.toLowerCase() === 'pago';
    const isLizianePago = typeof statusLiziane === 'string' && statusLiziane.toLowerCase() === 'pago';
    if (isRondonPago && isLizianePago) {
      div.classList.add('pago');
    }

    // Define as classes dos status com base nos valores
    const statusRondonClass = isRondonPago ? 'status-pago' : 'status-disponivel';
    const statusLizianeClass = isLizianePago ? 'status-pago' : 'status-disponivel';

    div.innerHTML = `
    <h3>${nomeFormatado}</h3>
    <img src="${imagem}" alt="${nomeFormatado}" class="passeio-imagem">
    <p>${descricao}</p>
    <p>Valor: R$ ${valor.toFixed(2)}</p>
    <p class="status ${statusRondonClass}">Status Rondon: ${statusRondon}</p>
    <button class="pagar-passeio" data-id="${id}" data-pessoa="Rondon" ${isRondonPago ? 'disabled' : ''}>
      Comprar Passeio para o Rondon
    </button>
    <p class="status ${statusLizianeClass}">Status Liziane: ${statusLiziane}</p>
    <button class="pagar-passeio" data-id="${id}" data-pessoa="Liziane" ${isLizianePago ? 'disabled' : ''}>
      Comprar Passeio para Liziane
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

    // Define valores padrão para statusRondon e statusLiziane se não existirem
    const statusRondon = dadosPasseio.statusRondon || "disponivel";
    const statusLiziane = dadosPasseio.statusLiziane || "disponivel";

    // Log para depuração
    console.log(`Passeio ${id} (${nomeFormatado}) para ${pessoa}:`, dadosPasseio);

    // Normaliza o status da pessoa selecionada
    const statusKey = `status${pessoa}`; // "statusRondon" ou "statusLiziane"
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
          statusLiziane: statusLiziane
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