
// function searchProduct(product) {
//   return `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
// }
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

// async function fetchAPI(url) {
//   const response = await fetch(url);
//   const responseJSON = await response.json();
//   return responseJSON;
// }

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCart() {
  window.localStorage.cart = cartList.innerHTML;
}

// function getCart() {
//   // const savedCartList = localStorage.getItem('cart_list');
//   // document.getElementsByClassName('cart__items').innerHTML = savedCartList;
//   // const cartList = document.querySelector('.cart__items');
//   // cartList.addEventListener('click', cartItemClickListener);
//   const shoppingCart = JSON.parse(localStorage.getItem('SHOPPING_CART'));
//   return shoppingCart || [];
// }

// let SHOPPING_CART_ARRAY = getCart();

// function setCart() {
//   // const cartList = document.querySelector('ol.cart__items').innerHTML;
//   // localStorage.setItem('cart_list', cartList);
//   console.log(SHOPPING_CART_ARRAY);
//   localStorage.setItem('SHOPPING_CART', JSON.stringify(SHOPPING_CART_ARRAY));
// }

async function updateTotalPrice() {
  // const totalPriceElement = document.querySelector('.total-price');
  // const total = SHOPPING_CART_ARRAY.reduce(
  //   (acc, item) => acc + item.salePrice,
  //   0,
  // );
  // totalPriceElement.innerText = total;
  let totalPrice = 0;
  await cartList.childNodes.forEach((a) => { totalPrice += Number(a.id); });
  totalElement.innerText = totalPrice;
}

function cartItemClickListener(event) {
  // const cartElement = document.querySelector('ol.cart__items');
  // cartElement.removeChild(event.target);
  // const newShoppingArray = SHOPPING_CART_ARRAY.filter(
  //   item => event.target.id !== item.sku,
  // );
  // SHOPPING_CART_ARRAY = newShoppingArray;
  // setCart();
  // await updateTotalPrice();

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

// function insertShoppingCart() {
//   const shoppingCart = getCart();

//   const items = shoppingCart.map(item => createCartItemElement(item));
//   setTimeout(() => {
//     items.forEach((item) => {
//       const cart = document.querySelector('.cart__items');
//       cart.appendChild(item);
//     });
//     updateTotalPrice();
//   }, 1);
// }
function produtItemCLickListener(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  appendCartItemById(id);
}

// async function addItemCart(id) {
//   const item = await fetchAPI(`https://api.mercadolibre.com/items/${id}`);
//   const formattedItem = {
//     sku: item.id,
//     name: item.title,
//     salePrice: item.price,
//   };

//   const cartItem = createCartItemElement(formattedItem);
//   const cartElement = document.querySelector('ol.cart__items');
//   cartElement.appendChild(cartItem);

//   SHOPPING_CART_ARRAY.push(formattedItem);

//   setCart();
//   await updateTotalPrice();
// }

// function handleButton(event) {
//   addItemCart(event.target.id);
// }

// function createCustomButton(id, className, innerText) {
//   const btn = document.createElement('button');
//   btn.id = id;
//   btn.className = className;
//   btn.innerHTML = innerText;
//   btn.addEventListener('click', handleButton);
//   return btn;
// }

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // section.appendChild(
  //   createCustomButton(sku, 'item__add', 'Adicionar ao carrinho!'),
  // );
  btnAdd.addEventListener('click', produtItemCLickListener);
  section.appendChild(btnAdd);

  return section;
}

// async function loadItems() {
//   const items = await fetchAPI(searchProduct('computador'));
//   // const data = await fetched.json();

//   const formattedItems = items.results.map(item => ({
//     sku: item.id,
//     name: item.title,
//     image: item.thumbnail,
//   }));

//   const sectionItems = document.getElementsByClassName('items')[0];
//   formattedItems.forEach((formattedItem) => {
//     const sectionItem = createProductItemElement(formattedItem);
//     sectionItems.appendChild(sectionItem);
//   });
// }

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

// async function clearCart() {
//   const cartElement = document.querySelector('.cart__items');
//   cartElement.innerHTML = '';
//   SHOPPING_CART_ARRAY.length = 0;

//   setCart();
//   await updateTotalPrice();
// }

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

// window.onload = function onload() {
//   loadItems();
//   insertShoppingCart();
//   const emptyCart = document.querySelector('.empty-cart');
//   emptyCart.addEventListener('click', clearCart);

//   setTimeout(() => {
//     document.querySelector('.loading').remove();
//   }, 3000);
// };
