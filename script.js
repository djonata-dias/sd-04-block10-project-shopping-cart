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
  // a partir do objeto coloca os produtos na section
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // ao clicar num produto, ele deve ser removido da lista
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendCartItemElement = ({ id, title, price }) => {
  const classCartItems = document.querySelector('.cart__items');
  // cria um novo objeto com as informações de id, nome e preço
  const obj = {};
  obj.sku = id;
  obj.name = title;
  obj.salePrice = price;
  // adiciona o objeto ao carrinho
  classCartItems.appendChild(createCartItemElement(obj));
  localStorage.cartItems = document.querySelector('ol.cart__items').innerHTML;
};

const infoProduct = (information) => {
  // cria um objeto com nome, id e imagem do produto
  const classItems = document.querySelector('.items');
  information.forEach(({ id, title, thumbnail }) => {
    classItems.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  const button = document.querySelectorAll('.item__add');
  button.forEach(elemento => elemento.addEventListener('click', function () {
    const item = elemento.parentNode.firstChild.innerHTML;
    const URL = `https://api.mercadolibre.com/items/${item}`;
    fetch(URL)
      .then(response => response.json())
      .then(data => appendCartItemElement(data));
  }));
};

const createClearButton = () => {
  if (Storage) document.querySelector('ol.cart__items').innerHTML = localStorage.cartItems;
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', function () {
    document.querySelector('ol.cart__items').innerHTML = '';
    localStorage.cartItems = '';
  });
};

window.onload = function onload() {
  setTimeout(() => {
    document.querySelector('.loading').remove();
    const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    // pega informações da API
    fetch(API_URL)
      .then(response => response.json())
      .then(data => infoProduct(data.results))
      .catch(console.log('Erro ao carregar página'))
    createClearButton();
  }, 5000);
};
