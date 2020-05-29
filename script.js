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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.addEventListener('click', () => addToCartClickListener(sku));

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

const cart = document.getElementsByClassName('cart__items')[0];

function cartItemClickListener() {
  cart.removeChild(this)
}

function addToCartClickListener(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(data => data.json())
    .then(obj => cart.appendChild(createCartItemElement(obj)));
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(data => data.json())
  .then(obj => obj.results)
  .then(arr => arr.forEach((product) => {
    document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(product));    
  }));

window.onload = function onload() { };
