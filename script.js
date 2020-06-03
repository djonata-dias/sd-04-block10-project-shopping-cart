const loadingElement = document.querySelector('.loading');
const cartElement = document.querySelector('.cart__items');
const localCart = localStorage.getItem('cart');
const totalPriceElement = document.querySelector('.total-price');
let totalPrice = { empty: 0 };
const localPrice = JSON.parse(localStorage.getItem('total-price'));

if (localCart) cartElement.innerHTML = localCart;

async function cartTotalPrice() {
  const prices = await Object.values(totalPrice);
  /* eslint-disable no-param-reassign */
  const pricesSum = prices.reduce((acc, price) => {
    acc += price;
    return acc;
  });
  /* eslint-disable no-param-reassign */
  totalPriceElement.innerHTML = pricesSum;
  localStorage.setItem('total-price', JSON.stringify(totalPrice));
}

if (localPrice) {
  Object.assign(totalPrice, localPrice);
  cartTotalPrice();
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

function decreaseTotalPriceClickListener(sku, salePrice) {
  if (totalPrice[sku]) totalPrice[sku] -= salePrice;
  else delete totalPrice[sku];
  cartTotalPrice();
}

function cartItemClickListener() {
  cartElement.removeChild(this);
  localStorage.setItem('cart', cartElement.innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;

  // Adds this item's price to total price to pay
  if (totalPrice[sku]) totalPrice[sku] += salePrice;
  else totalPrice[sku] = salePrice;
  return li;
}

function addToCartClickListener(id) {
  loadingElement.style.display = 'flex';

  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((data) => {
      loadingElement.style.display = 'none';
      return data.json();
    })
    .then((obj) => {
      cartElement.appendChild(createCartItemElement(obj));
      localStorage.setItem('cart', cartElement.innerHTML);
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

function fetchProducts() {
  loadingElement.style.display = 'flex';

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((data) => {
      loadingElement.style.display = 'none';
      return data.json();
    })
    .then(obj => obj.results)
    .then(arr => arr.forEach((product) => {
      document.getElementsByClassName('items')[0]
        .appendChild(createProductItemElement(product));
    }));
}

document.getElementsByClassName('empty-cart')[0]
  .addEventListener('click', () => {
    while (cartElement.firstChild) cartElement.removeChild(cartElement.lastChild);
    localStorage.setItem('cart', cartElement.innerHTML);
    totalPrice = { empty: 0 };
    cartTotalPrice();
  });

window.onload = fetchProducts();
