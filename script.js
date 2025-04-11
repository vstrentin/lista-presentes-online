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
        const errorData = await response.json();
        throw new Error(errorData.details || 'Erro ao criar pagamento');
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