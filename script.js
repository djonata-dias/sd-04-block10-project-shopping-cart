window.onload = function onload() {
  fetchProduct();
};
// ----


const getData = (arr) => {
  const sectionItem = document.querySelector('section.items');
  arr.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const newObj = { sku, name, image };
    sectionItem.appendChild(createProductItemElement(newObj));
  });
};

const fetchProduct = () => {
  const QUERY = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  fetch(API_URL)
    .then(response => response.json())
    .then(data => getData(data.results));
};

function addToCartObj(obj) {
  const { id: sku, title: name, price: salePrice } = obj;
  console.log({ sku, name, salePrice });
  return { sku, name, salePrice };
}

const addToCart = (id) => {
  console.log(id)
  const API_ID = `https://api.mercadolibre.com/items/${id}`;
  fetch(API_ID)
  .then(response => response.json())
  .then(data => addToCartObj(data))
  .then(obj => createCartItemElement(obj))
  .then(item => document.querySelector('ol.cart__items').appendChild(item));
};

// ----

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, id = null) {
  const e = document.createElement(element);
  if (element === 'button') e.addEventListener('click', () => {
    addToCart(id);
  }) // Se for button cria um event com a função addToCart
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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const section = document.querySelector('ol.cart__items');
  section.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
