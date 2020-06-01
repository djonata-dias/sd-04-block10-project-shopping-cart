const totalPriceElement = document.getElementsByClassName('total-price')[0];
let totalPrice = {};
const cart = document.getElementsByClassName('cart__items')[0];
const savedCart = localStorage.getItem('cart');
if (savedCart) cart.innerHTML = savedCart;

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

function decreaseItemPriceFromTotal(sku, salePrice) {
  if (totalPrice[sku]) totalPrice[sku] -= salePrice;
  else delete totalPrice[sku]; 
  cartTotalPrice();
}

function cartItemClickListener() {
  cart.removeChild(this);
  localStorage.setItem('cart', cart.innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', () => decreaseItemPriceFromTotal(sku, salePrice));
  // Adds this item's price to total price to pay
  if (totalPrice[sku]) totalPrice[sku] += salePrice;
  else totalPrice[sku] = salePrice;
  return li;
}

function addToCartClickListener(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(data => data.json())
    .then((obj) => {
      cart.appendChild(createCartItemElement(obj));
      localStorage.setItem('cart', cart.innerHTML);
      cartTotalPrice();
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const addToCartBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartBtn.addEventListener('click', () => addToCartClickListener(sku));
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addToCartBtn);

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(data => data.json())
  .then(obj => obj.results)
  .then(arr => arr.forEach((product) => {
    document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(product));
  }));

async function cartTotalPrice() {
  const prices = await Object.values(totalPrice);
  totalPriceElement.innerHTML = prices.reduce((acc, price) => acc += price);
}

document.getElementsByClassName('empty-cart')[0]
  .addEventListener('click', () => {
    while (cart.firstChild) cart.removeChild(cart.lastChild);
    localStorage.setItem('cart', cart.innerHTML);
    totalPrice = { 'empty': 0 };
    cartTotalPrice();
  });


window.onload = function onload() { };
