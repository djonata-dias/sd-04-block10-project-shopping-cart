window.onload = function onload() {};

const buttonErase = document.querySelector('.empty-cart');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function cartItemClickListener(event) {
  // ESTA FUNÇÃO RETIRA OS ITEMS DO CARRINHO UTILIZANDO O PARAMETRO EVENT
  // coloque seu código aqui
  const selecionado = event.target;
  // O PARAMETRO EVENT ATRAVÉS DO TARGET MAPEIA O LOCAL CLICADO COM
  // O MOUSE E É ATRIBUÍDO A VARIÁVEL SELECIONADO
  selecionado.innerHTML = '';
  // A VARIÁVEL SELECIONADO É PREENCHIDA COM VALOR NENHUM PARA QUE POSSA SER APAGADA DO CARRINHO
  selecionado.parentNode.removeChild(selecionado);
  // A VARIÁVEL SELECIONADO É UMA REFERÊNCIA PARA QUE POSSAMOS BUSCAR O PAI DO ELEMENTO
  // HTML ATRAVÉS DO COMANDO PARENTNODE, A PARTIR DISTO, O ELEMENTO
  // É REMOVIDO COM O COMANDO REMOVECHILD
}

function createCartItemElement({ sku, name, salePrice }) {
  //  console.log(sku, name, salePrice)
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const convertObject = (dataArray) => {
  // ESTA FUNÇÃO RETIRA OS CAMPOS DO OBJETO QUE SÃO NECESSÁRIOS
  const itemClass = document.querySelector('.items');
  // PRIMEIRO SELECIONAMOS O ITEM HTML .items E O ATRBUÍMOS A VARIÁVEL itemClass
  dataArray.forEach(({ id, title, thumbnail, price }) => {
    // UM LOOP É INICIADO PARA QUE OS ITEMS ID, TITLE E PRICE SEJAM COPIADOS
    // DA LISTA DE TODOS OS ITEMS
    itemClass.appendChild(
      createProductItemElement({ sku: id, name: title, image: thumbnail })); 
    // OS VALORES COPIADOS SÃO SETADOS NOS CAMPOS SKU, NAME E IMAGE, AUTOMATICAMENTE ESTES
    // VALORES SÃO INSERIDOS NO ELEMENTO HTML ATRAVÉS DE ITEMCLASS
    itemClass.lastElementChild.addEventListener('click', () => {
      // ESSA FUNÇÃO INSERE OS ITEMS AO CARRINHO DE COMPRAS USANDO EVENT
      const cartItems = document.querySelector('.cart__items');
      // ATRIBUÍMOS O ELEMENTO CART_ITEMS HTML A VARIÁVEL cartItems
      const itemCart = createCartItemElement({
        sku: id,
        name: title,
        salePrice: price,
      }); // CRIAMOS O ELEMENTO HTML LI COM OS DADOS PASSADOS DO dataArray
      itemCart.classList.add('added');
      cartItems.appendChild(itemCart);
      // INSERIMOS O ELEMENTO LI COM SEUS VALORES COMO FILHO DA LISTA CART_ITEMS
      // localStorage.setItem('carrinho', itemCart);
    });
  });
};

// FUNÇÃO QUE PEGA O OBJETO E FORMATA NO MODO JSON PARA QUE POSSAMOS MANIPULÁ-LO
const getObject = (busca) => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q='; // USA O ENDEREÇO DA API DO MERCADO LIVRE

  fetch(API_URL + busca) // FUNÇÃO FETCH USA O LINK PARA BUSCAR A PESQUISA DE COMPUTADOR
    .then(response => response.json()) // TRANSFORMA O OBJETO PARA MANIPULAÇÃO
    .then(data => convertObject(data.results));
    // EXTRAI AS INFORMAÇÕES DE RESULTS, QUE É A QUE CONTEM OS CAMPOS QUE PRECISAMOS
};

getObject('Computador'); // ESSA CHAMADA INICIA O PROGRAMA CHAMANDO A FUNÇÃO
// GETOBJECT E BUSCAR A PALAVRA 'COMPUTADOR'

const eraseCart = () => {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
};

buttonErase.addEventListener('click', eraseCart);
