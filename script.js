function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function fetchAPI(url) {
  const response = await fetch(url);
  const responseJSON = await response.json();
  return responseJSON;
}
// Retorna o carrinho de compras no local storage
function getItemStorage() {
  const cart = JSON.parse(localStorage.getItem('SHOPPING_CART'));
  return cart;
}

let CART_ARRAY = getItemStorage();
// Atualiza o carrinho de compras do local storage
function updateItemStorage() {
  console.log(CART_ARRAY);
  localStorage.setItem('SHOPPING_CART', JSON.stringify(CART_ARRAY));
}
// Atualiza o preço total do carrinho de compras de forma assíncrona
async function updateTotalPrice() {
  const totalPriceElement = document.getElementById('total-price');
  const total = CART_ARRAY.reduce(
    (acc, item) => acc + item.salePrice, 0,
  );
  totalPriceElement.innerText = total;
}
// Função que será adicionada nos items do carrinho de compras com callbacks 
async function cartItemClickListener(event) {
  const cartElement = document.querySelector('ol.cart__items');
  cartElement.removeChild(event.target);
  const newShoppingArray = CART_ARRAY.filter(
    item => event.target.id !== item.sku,
  );
  CART_ARRAY = newShoppingArray;
  updateItemStorage();
  await updateTotalPrice();
}
// Cria um elemento li com as informações do objeto item passado
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class='price'>${salePrice}</span>`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function insertItems() {
  const shoppingCart = getItemStorage();
  const items = shoppingCart.map(item => createCartItemElement(item));
  setTimeout(() => {
    items.forEach((item) => {
      const cart = document.getElementById('cart');
      cart.appendChild(item);
    });
    updateTotalPrice();
  }, 1);
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
  CART_ARRAY.push(formattedItem);

  updateItemStorage();
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
// Função que cria um elemento do objeto do item passado como parametro
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
  formattedItems.forEach((formattedItem) => {
    const sectionItem = createProductItemElement(formattedItem);
    sectionItems.appendChild(sectionItem);
  });
}

async function clearCart() {
  const cartElement = document.querySelector('ol.cart__items');
  cartElement.innerHTML = '';
  CART_ARRAY.length = 0;

  updateItemStorage();
  await updateTotalPrice();
}

window.onload = function onload() {
  listItems();
  insertItems();
  const clearButton = document.getElementById('empty-cart');
  clearButton.addEventListener('click', clearCart);
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 1000);
};
