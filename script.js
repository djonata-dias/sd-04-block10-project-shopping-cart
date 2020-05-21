async function fetchAPI(url) {
  const response = await fetch(url);
  const responseJSON = await response.json();
  return responseJSON;
}

async function cartItemClickListener(event) {
  const cartElement = document.querySelector('ol.cart__items');
  cartElement.removeChild(event.target);
  const newShoppingArray = SHOPPING_CART_ARRAY.filter(
    item => event.target.id !== item.sku
    );
    SHOPPING_CART_ARRAY = newShoppingArray;

  updateShoppingCartLocalStorage();
  await updateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class='price'>${salePrice}</span>`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getShoppingCartLocalStorage() {
  const shoppingCart = JSON.parse(localStorage.getItem('SHOPPING_CART'));

  const items = shoppingCart.map(item => createCartItemElement(item));
  setTimeout(() => {
    items.forEach((item) => {
      const cart = document.getElementById('cart');
      cart.appendChild(item);
    });
    updateTotalPrice();
  }, 1);

  return shoppingCart;
}

let SHOPPING_CART_ARRAY = getShoppingCartLocalStorage() || [];

async function updateTotalPrice() {
  const totalPriceElement = document.getElementById('total-price');
  const total = SHOPPING_CART_ARRAY.reduce(
    (acc, item) => acc + item.salePrice,
    0,
  );
  totalPriceElement.innerText = total.toFixed(2);
}


function updateShoppingCartLocalStorage() {
  console.log(SHOPPING_CART_ARRAY);
  localStorage.setItem('SHOPPING_CART', JSON.stringify(SHOPPING_CART_ARRAY));
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

async function addItemToCart(id) {
  const item = await fetchAPI(`https://api.mercadolibre.com/items/${id}`);
  const formattedItem = {
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  };

  const cartItem = createCartItemElement(formattedItem);

  const cartElement = document.querySelector('ol.cart__items');
  cartElement.appendChild(cartItem);

  SHOPPING_CART_ARRAY.push(formattedItem);

  updateShoppingCartLocalStorage();
  await updateTotalPrice();
}

function handleButton(event) {
  addItemToCart(event.target.id);
}

function createCustomButton(id, className, innerText) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.className = className;
  btn.innerHTML = innerText;
  btn.addEventListener('click', handleButton);
  return btn;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomButton(sku, 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}



async function listItems() {
  const items = await fetchAPI(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  const formattedItems = items.results.map(item => ({
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
  }));

  const sectionItems = document.getElementsByClassName('items')[0];
  sectionItems.innerHTML = '';

  formattedItems.forEach((formattedItem) => {
    const sectionItem = createProductItemElement(formattedItem);
    sectionItems.appendChild(sectionItem);
  });
}

async function clearCart() {
  const cartElement = document.querySelector('ol.cart__items');
  cartElement.innerHTML = '';
  SHOPPING_CART_ARRAY.length = 0;

  updateShoppingCartLocalStorage();
  await updateTotalPrice();
}

window.onload = function onload() {
  listItems();
  const clearButton = document.getElementById('empty-cart');
  clearButton.addEventListener('click', clearCart);

  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  const sectionItems = document.getElementsByClassName('items')[0];
  sectionItems.appendChild(loading);
};
