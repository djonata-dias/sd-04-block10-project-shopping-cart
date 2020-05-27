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

// Função para atualizar o preço dos produtos no carrinho a cada interação!
const updateValue = () => {
  const span = document.querySelector('.total-price');
  let update = 0;
  span.innerHTML = '';
  Object.values(localStorage).forEach((e) => {
    update += parseFloat(e);
  });
  span.innerHTML = `Valor Total: R$ ${update.toFixed(2)}`;
  return span;
};

// função para criar imagem do produto.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Pega o ID da section que o addlistener está!
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// função para remover produto do carrinho.
const cartItemClickListener = (e) => {
  e.target.remove();
};

// Função que cria o elemento no Carrinho de compras.
function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const recebeId = (id) => {
  const ol = document.querySelector('ol.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then((data) => {
      const sku = data.id;
      const name = data.title;
      const price = data.price;
      localStorage.setItem(id, price);
      return ol.appendChild(createCartItemElement(sku, name, price), updateValue());
    });
};

// função para Receber o click, puxar o ID via getskuFromProductItem,
// rodar API e adicionar ao carrinho e LocalStorage.
const moveToCart = (e) => {
  e.addEventListener('click', function () {
    const id = getSkuFromProductItem(e.parentNode);
    recebeId(id);
  });
};

// Carrega o Carrinho de compra armazenado do localStorage.
const recuperaCarrinho = () => Object.keys(localStorage).forEach(e => recebeId(e));

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
    updateValue();
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

const prices = () => {
  const cart = document.querySelector('.cart');
  const span = document.createElement('span');
  span.className = 'total-price';
  cart.appendChild(span);
};

const chamaTudo = () => {
  criaList();
  limpaCarrinho();
  recuperaCarrinho();
  prices();
  updateValue();
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
  }, 1500);
};
