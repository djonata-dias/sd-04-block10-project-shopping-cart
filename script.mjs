import requestAPI from './helpers/requestAPI.js';

const api = async () => {
  return (
    document.getElementsByClassName('loading')[0].remove(),
    await requestAPI('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  )
};
const cart = document.getElementsByClassName('cart__items')[0];
const totalPrice = document.getElementsByClassName('total-price')[0];
const storageCart = JSON.parse(localStorage.getItem('shoppingCart'));
const cartArray = storageCart ? storageCart : [];
const updateCart = (array) => {
  if (!cartArray.length) localStorage.setItem('shoppingCart', JSON.stringify([]));
  localStorage.setItem('shoppingCart', JSON.stringify([...array]));
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
  totalPrice.innerText = +totalPrice.innerText - salePrice
  console.log(event.target.innerHTML);
  cartArray.forEach((item, index) => {
    if (item === event.target.innerHTML) {
      cartArray.splice(index, 1)
    }
  })
  await event.target.remove()
  updateCart(cartArray)
}

async function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (e) => cartItemClickListener(e, salePrice));
  cart.appendChild(li)
  cartArray.push(li.innerHTML)
  updateCart(cartArray)
  totalPrice.innerText = +totalPrice.innerText + salePrice
}
const setInitialItens = async () => {
  cartArray.forEach(item => {
    const li = document.createElement('li');
    const salePrice = +item.split('| PRICE: $')[1]
    li.className = 'cart__item';
    li.innerText = item;
    li.addEventListener('click', (e) => cartItemClickListener(e, salePrice));
    cart.appendChild(li)
    totalPrice.innerText = +totalPrice.innerText + salePrice
  })
}

window.onload = async function onload() {
  const items = (await api()).results;
  items.forEach((item) => createProductItemElement(item));
  console.log(items);
  updateCart(cartArray)
  setInitialItens()
};
