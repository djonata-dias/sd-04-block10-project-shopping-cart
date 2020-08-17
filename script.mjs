import requestAPI from './helpers/requestAPI.js';

const api = async () => await requestAPI('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
const cart = document.getElementsByClassName('cart__items')[0];
const totalPrice = document.getElementsByClassName('total-price')[0];
const storageCart = localStorage.getItem('shoppingCart');
const updateCart = () => {
  if (!storageCart) {
    localStorage.setItem('shoppingCart', '[]')
  }
  console.log(storageCart);
  const newCart = [...cart.childNodes].map(item => (item.innerHTML))

  console.log(newCart);
  console.log(([JSON.stringify(...cart.childNodes)]));
  [...cart.childNodes].forEach(item => console.log(item.innerHTML))

  // localStorage.setItem('shoppingCart', [...cart.childNodes])
  console.log(storageCart);

}
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
  return list.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event, salePrice) {
  console.log(cart);
  totalPrice.innerText = +totalPrice.innerText - salePrice
  await event.target.remove()

  updateCart()
  console.log(event.target);
  // coloque seu código aqui
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (e) => cartItemClickListener(e, salePrice));
  cart.appendChild(li);
  totalPrice.innerText = +totalPrice.innerText + salePrice
  updateCart()

}
window.onload = async function onload() {
  const items = (await api()).results;
  document.getElementsByClassName('loading')[0].remove()
  items.forEach((item) => createProductItemElement(item));
  console.log(items);
  console.log('mount');
};
