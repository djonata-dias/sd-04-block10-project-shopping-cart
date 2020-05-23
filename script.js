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

async function updatePrice() {
  let totalPrice = 0;
  const cartList = await document.querySelectorAll('.cart__items .cart__item');
  const cartTotalPrice = await document.querySelector('.total-price');
  await cartList.forEach((item) => {
    const itemArray = item.innerHTML.split(' ');
    const itemPrice = +itemArray[itemArray.length - 1].replace('$', '');
    totalPrice += +itemPrice;
  });
  cartTotalPrice.innerText = await totalPrice;
}

function setCartListLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  const stringfyCartItems = JSON.stringify(cartItems.innerHTML);
  localStorage.setItem('cartItems', stringfyCartItems);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  updatePrice();
  setCartListLocalStorage();
}

function getCartListLocalStorage() {
  const cartItemsList = document.querySelector('.cart__items');
  const cartList = JSON.parse(localStorage.getItem('cartItems'));
  cartItemsList.innerHTML = cartList;
  const cartItems = document.querySelectorAll('.cart__items .cart__item');
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createItemObject(array) {
  const productsSection = document.querySelector('.items');
  array.forEach((item) => {
    const product = createProductItemElement({
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    });
    productsSection.appendChild(product);
  });
}

const addToCart = async (event) => {
  const targetButton = event.target;
  const itemId = getSkuFromProductItem(targetButton.parentNode);
  const itemIdQuery = await (await fetch(`https://api.mercadolibre.com/items/${itemId}`)).json();
  const itemLi = await createCartItemElement({
    sku: itemIdQuery.id,
    name: itemIdQuery.title,
    salePrice: itemIdQuery.price,
  });
  const cart = document.querySelector('.cart__items');
  cart.appendChild(itemLi);
  setCartListLocalStorage();
  updatePrice();
};

const addToCartButton = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach(item => item.addEventListener('click', addToCart));
};

function emptyCart() {
  const emptyCartBtn = document.querySelector('.empty-cart');
  const cartList = document.querySelector('.cart__items');
  emptyCartBtn.addEventListener('click', () => {
    cartList.innerHTML = '';
    updatePrice();
    setCartListLocalStorage();
  });
}

function addLoader() {
  const loader = document.querySelector('.loading');
  loader.innerHTML = 'loading...';
}

function removeLoader() {
  const loader = document.querySelector('.loading');
  loader.innerHTML = '';
}

const getQuery = async () => {
  addLoader();
  const query = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonResult = await query.json();
  const queryResults = await jsonResult.results;
  await createItemObject(queryResults);
  removeLoader();
  await addToCartButton();
  await getCartListLocalStorage();
  await updatePrice();
  await emptyCart();
};

window.onload = function onload() {
  getQuery();
};
