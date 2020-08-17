import requestAPI from './helpers/requestAPI.js';

const api = async () => await requestAPI('https://api.mercadolibre.com/sites/MLB/search?q=$computador');

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

function createProductItemElement({ id, title, thumbnail, price }) {
  const list = document.getElementsByClassName('items')[0]
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const addCart = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addCart.addEventListener('click', () => createCartItemElement(id, title, price))
  console.log(addCart);
  return list.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement(sku, name, salePrice) {
  const cart = document.getElementsByClassName('cart__items')[0];
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return cart.appendChild(li);

}
window.onload = async function onload() {
  const items = (await api()).results;
  items.forEach((item) => createProductItemElement(item));
  console.log(items);

};
