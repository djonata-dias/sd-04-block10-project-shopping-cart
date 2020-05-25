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
  // cria os componentes HTML referentes a um produto
  // a partir do objeto coloca os produtos na section
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const addPrice = () => {
  cartList = document.querySelector('.cart__items').childNodes;
  let total = 0;
  // Soma os valores dos itens atraves do id que equivale ao salePrice do produto;
  cartList.forEach((list) => { total += Number(list.id); });
  document.querySelector('.total-price').innerHTML = `Valor total do carrinho: ${total}`;
};

const createClearButton = () => {
  // botão para remover todos os itens do carrinho de compras
  if (Storage) {
    document.querySelector('ol.cart__items').innerHTML = localStorage.cartItems;
    document.querySelector('.total-price').innerHTML = localStorage.price;
  }
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', function () {
    document.querySelector('ol.cart__items').innerHTML = ''; // limpar o carrinho
    // também remove os dados do LocalStorage
    localStorage.cartItems = '';
    document.querySelector('.total-price').innerHTML = 0; // após limpar o carrinho o preço zera
    localStorage.price = '';
  });
};

function cartItemClickListener(event) {
  // ao clicar num produto, ele deve ser removido da lista
  event.target.remove();
  addPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  // cria os componentes HTML referentes a um item do carrinho
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = salePrice;
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
  // adiciona o elemento retornado da função createCartItemElement(product)
  // como filho do elemento <ol class="cart__items">.
  classCartItems.appendChild(createCartItemElement(obj));
  // carrinho de compras deve ser salvo no LocalStorage
  localStorage.cartItems = document.querySelector('ol.cart__items').innerHTML;
  addPrice();
  localStorage.price = document.querySelector('.total-price').innerHTML;
};

const infoProduct = (information) => {
  // cria um objeto com nome, id e imagem do produto
  const classItems = document.querySelector('.items');
  // Adicione o elemento retornado da função createProductItemElement(product)
  // como filho do elemento <section class="items">
  information.forEach(({ id, title, thumbnail }) => {
    classItems.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  const button = document.querySelectorAll('.item__add');
  // Ao clicar nesse realiza uma requisição para o endpoint
  button.forEach(elemento => elemento.addEventListener('click', function () {
    const item = elemento.parentNode.firstChild.innerHTML;
    const URL = `https://api.mercadolibre.com/items/${item}`;
    fetch(URL)
      .then(response => response.json())
      .then(data => appendCartItemElement(data));
  }));
};

const firstRequisition = () => {
  // cria listagem de produtos consultados através da API do Mercado livre
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(API_URL)
    .then(response => response.json())
    .then(data => infoProduct(data.results));
};

window.onload = function onload() {
  // adiciona um texto de "loading" durante uma requisição à API e depois o remove
  setTimeout(() => document.querySelector('.loading').remove(), 3000);
  firstRequisition();
  createClearButton();
};
