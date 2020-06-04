
function searchProduct(product) {
  return `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function getCart() {
  // const savedCartList = localStorage.getItem('cart_list');
  // document.getElementsByClassName('cart__items').innerHTML = savedCartList;
  // const cartList = document.querySelector('.cart__items');
  // cartList.addEventListener('click', cartItemClickListener);
  const shoppingCart = JSON.parse(localStorage.getItem('SHOPPING_CART'));
  return shoppingCart || [];
}

let SHOPPING_CART_ARRAY = getCart();

function setCart() {
  // const cartList = document.querySelector('.cart__items').innerHTML;
  // localStorage.setItem('cart_list', cartList);
  console.log(SHOPPING_CART_ARRAY);
  localStorage.setItem('SHOPPING_CART', JSON.stringify(SHOPPING_CART_ARRAY));
}

async function updateTotalPrice() {
  const totalPriceElement = document.querySelector('.total-price');
  const total = SHOPPING_CART_ARRAY.reduce(
    (acc, item) => acc + item.salePrice,
    0,
  );
  totalPriceElement.innerText = total;
}

async function cartItemClickListener(event) {
  event.target.remove();
  /*
  const cartElement = document.querySelector('ol.cart__items');
  cartElement.removeChild(event.target);
  */
  const newShoppingArray = SHOPPING_CART_ARRAY.filter(
    item => event.target.id !== item.sku,
  );
  SHOPPING_CART_ARRAY = newShoppingArray;
  setCart();
  await updateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function insertShoppingCart() {
  const shoppingCart = getCart();

  const items = shoppingCart.map(item => createCartItemElement(item));
  setTimeout(() => {
    items.forEach((item) => {
      const cart = document.querySelector('.cart');
      cart.appendChild(item);
    });
    updateTotalPrice();
  }, 1);
}

async function addItemCart(id) {
  const fetched = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const item = await fetched.json();
  const formattedItem = {
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  };

  const cartItem = createCartItemElement(formattedItem);

  const cartElement = document.querySelector('ol.cart__items');
  cartElement.appendChild(cartItem);

  SHOPPING_CART_ARRAY.push(formattedItem);

  setCart();
  await updateTotalPrice();
}

function handleButton(event) {
  addItemCart(event.target.id);
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
  // const btnAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(
    createCustomButton(sku, 'item__add', 'Adicionar ao carrinho!'),
  );
  // btnAdd.addEventListener('click', handleButton);

  // section.appendChild(btnAdd);

  return section;
}

async function clearCart() {
  const cartElement = document.querySelector('ol.cart__items');
  cartElement.innerHTML = '';
  SHOPPING_CART_ARRAY.length = 0;

  setCart();
  await updateTotalPrice();
}

async function loadItems() {
  const fetched = await fetch(searchProduct('computador'));
  const data = await fetched.json();
  // const itemsList =
  await data.results.forEach((product) => {
    document.querySelector('.items').appendChild(
      createProductItemElement({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      }));
  });
}

window.onload = function onload() {
  loadItems();
  insertShoppingCart();
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', clearCart);

  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 3000);
};
