const query = 'computador';
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
// função para pegar as infos do produto.
const pegaInfos = ({ id, title, salePrice, thumbnail }, callback) => {
  const obj = {
    sku: id,
    name: title,
    price: salePrice,
    image: thumbnail,
  };
  return callback(obj);
};

// função para criar imagem do produto.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função para puxar o ID do produto a partir da Section, onde foi clicado para add ao carrinho.
const request2 = async (id) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const responseJson = await response.json();
    console.log(responseJson.results);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

// Pega o ID da section que o addlistener está!
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// função para remover produto do carrinho.
const cartItemClickListener = (e) => {
  e.target.remove();
};

// Função que cria o elemento no Carrinho de compras.
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// função para acessa a section
const moveToCart = (e) => {
  const ol = document.querySelector('ol.cart__items');
  e.addEventListener('click', function () {
    const id = getSkuFromProductItem(e.parentNode);
    const json = request2(id);
    localStorage.setItem(`product#${Math.random().toPrecision(3)}`, id);
    return ol.appendChild(pegaInfos(json, createCartItemElement));
  });
};

// Carrega o Carrinho de compra armazenado do localStorage.
const recuperaCarrinho = () => {
  const ol = document.querySelector('ol.cart__items');
  Object.values(localStorage).forEach((e) => {
    ol.appendChild(pegaInfos(e, createCartItemElement));
  });
};

// Função que Cria os Buttons e addo listener com a função para jogar no carrinho.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    moveToCart(e);
  }
  return e;
}

// função para criar lista de produtos retornados da API.
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// Limpa o carrinho de Compra e da um clear no localStorage.
const limpaCarrinho = () => {
  const btnLimpa = document.querySelector('.empty-cart');
  const listCartProducts = document.querySelector('ol.cart__items');
  btnLimpa.addEventListener('click', function () {
    listCartProducts.innerHTML = '';
    localStorage.clear();
  });
};

// Cria a Lista de Produtos
const criaList = async () => {
  const listItens = document.querySelector('.items');
  try {
    const response = await fetch(`${API_URL}${query}`);
    const responseJson = await response.json();
    const products = responseJson.results;
    await products.forEach((e) => {
      listItens.appendChild(pegaInfos(e, createProductItemElement));
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

const chamaTudo = () => {
  criaList();
  limpaCarrinho();
  recuperaCarrinho();
};

const loading = () => {
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerHTML = 'loading...';
  return document.querySelector('section.items').appendChild(div);
};

const limpaLoading = () => document.querySelector('div').remove();

window.onload = () => {
  loading();
  setTimeout(() => {
    limpaLoading();
    chamaTudo();
  }, 5000);
};
