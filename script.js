let cartList;
let totalElement;

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCart() {
  window.localStorage.cart = cartList.innerHTML;
}

async function updateTotalPrice() {
  let totalPrice = 0;
  await cartList.childNodes.forEach((a) => { totalPrice += Number(a.id); });
  totalElement.innerText = totalPrice;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  updateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getElementWithCallback({ id, title, price, thumbnail }, callback) {
  const obj = {
    sku: id,
    name: title,
    salePrice: price,
    image: thumbnail,
  };
  return callback(obj);
}

async function appendCartItemById(id) {
  try {
    const fetched = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const jsonResult = await fetched.json();
    await cartList.appendChild(
      getElementWithCallback(jsonResult, createCartItemElement));
    saveCart();
    updateTotalPrice();
  } catch (error) {
    console.log(error);
  }
}

function produtItemCLickListener(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  appendCartItemById(id);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', produtItemCLickListener);
  section.appendChild(button);

  return section;
}

function loadCart() {
  if (!window.localStorage.cart) return;
  cartList.innerHTML = window.localStorage.cart;
  cartList.childNodes
    .forEach(elem => elem.addEventListener('click', cartItemClickListener));
  updateTotalPrice();
}

function removeAll() {
  while (cartList.firstChild) {
    cartList.removeChild(cartList.lastChild);
  }
  updateTotalPrice();
}

async function loadItems() {
  const itemsList = document.querySelector('.items');
  try {
    const fetched = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const jsonResult = await fetched.json();
    await jsonResult.results.forEach((product) => {
      itemsList.appendChild(getElementWithCallback(product, createProductItemElement));
    });
  } catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  totalElement = document.querySelector('.total-price');
  cartList = document.querySelector('.cart__items');
  document.querySelector('.empty-cart').addEventListener('click', removeAll);
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 2000);
  loadCart();
  loadItems();
};
