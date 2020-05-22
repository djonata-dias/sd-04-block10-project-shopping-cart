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

const convertObject = (dataArray) => {
  const itemClass = document.querySelector('.items');
  dataArray.forEach(({ id, title, thumbnail }) => {
    itemClass.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
    console.log(itemClass);
  });
};

const getObject = (busca) => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

  fetch(API_URL + busca)
  .then(response => response.json())
  .then(data => convertObject(data.results));
//  .then(data => console.log(data.results[0]))
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

getObject('TV');

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
