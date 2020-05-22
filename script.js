window.onload = function onload() { };

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
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const funcObjToCart = (data) => {
  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(obj));
};
const addCartListener = () => {
  const nodeItems = document.querySelectorAll('.item');
  nodeItems.forEach((element) => {
    element.lastElementChild.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${element.firstElementChild.innerHTML}`)
        .then(response => response.json())
        .then(data => funcObjToCart(data))
        .catch(error => console.log(error));
    });
  });
};
const funcObjectToList = (arrResults) => {
  const classItems = document.querySelector('.items');
  arrResults.forEach(({ id, title, thumbnail }) => {
    classItems.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  addCartListener();
};
const callAPI = () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(API_URL)
    .then(response => response.json())
    .then(data => funcObjectToList(data.results))
    .catch(console.log('error'));
};

callAPI();
