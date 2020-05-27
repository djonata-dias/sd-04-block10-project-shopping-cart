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
  section.appendChild(
  createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}
// Save in localstorage all the HTML ot the cart list
function storeCart() {
  // To be improved must use aJson
  const cartListOl = document.getElementsByClassName('cart__items');
  localStorage.setItem('cartItem', cartListOl[0].innerHTML);
}

// Sum the price of all items in the cart return number
async function sumPrice() {
  // Could be reduce?????
  const cartListLi = document.querySelectorAll('.cart__item');
  let sum = 0;
  cartListLi.forEach(index => (sum += parseFloat(index.innerText.split('$')[1])));
  // sum = Math.round(sum * 100) / 100; to round the price but Cypress doen't accept
  document.querySelector('.total-price').innerText = sum;
}

function cartItemClickListener(event) {
  event.target.remove();
  sumPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Fetch to call the infomation related to Id and call createCartItemElement
async function fetchId(idToFecth) {
  fetch(`https://api.mercadolibre.com/items/${idToFecth}`)
  .then(response => response.json())
  .then((data) => {
    const cartItemElenet = document.getElementsByClassName('cart__items');
    cartItemElenet[0].appendChild(
      createCartItemElement({
        sku: idToFecth,
        name: data.title,
        salePrice: data.price,
      }),
      );
    storeCart(); // Save the cart in LocalStorage
    sumPrice(); // Sum all items'Price of the cart
  })
    .catch(error => console.log(error));
}

// Async function to call the sum only after fetch return all data
// to avoid summing empty data
async function createCartAsync(idToFecth) {
  await fetchId(idToFecth);
  sumPrice();
}

// remove all items of the cart
function removeCartItems() {
  const cartListOl = document.getElementsByClassName('cart__items');
  while (cartListOl[0].firstChild) {
    cartListOl[0].removeChild(cartListOl[0].firstChild);
  }
  storeCart(); // Save the cart in LocalStorage
  sumPrice(); // Sum all items'Price of the cart
}
const span = document.createElement('span');
const containerElement = document.getElementsByClassName('cart__title');
const sectionItems = document.getElementsByClassName('items');

// Load the cart information stored in Localstorage
function loadCart() {
  // To be improved using a janson
  console.log(localStorage.getItem('cartItem'));
  const cartListOl = document.getElementsByClassName('cart__items');
  cartListOl[0].innerHTML = localStorage.getItem('cartItem');
}
// let query = 'computador'; // this query is the keyword of fltch search
const launchFetch = (query) => {
  console.log('query inside', query);
  const cartListOl = document.getElementsByClassName('items');
  while (cartListOl[0].firstChild) {
    cartListOl[0].removeChild(cartListOl[0].firstChild);
  }
  containerElement[0].appendChild(span); // create a tempory span during flecth loading
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query})`)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        sectionItems[0].appendChild(
          createProductItemElement({
            sku: result.id, name: result.title, image: result.thumbnail }));
      });
      setTimeout(function () {
        span.parentNode.removeChild(span);
      }, 1000);
    })
    .catch(error => console.log(error));
};

// const query = 'computador'; // this query is the keyword of fltch search
const searchInput = document.querySelector('.search-input');
span.innerText = 'loading...'; // text displayed during flecth loading
span.className = 'loading'; // Class of flecth loading

document.body.addEventListener('click', function (event) {  // find the Id of the clicked add to cart button
  console.log(event.target.className); // to remove
  console.log('hello'); // to remov
  if (event.target.className === 'item__add') {
    createCartAsync(
      event.target.parentNode.querySelector('span.item__sku').innerText);
  }
  if (event.target.className.includes('empty-cart')) removeCartItems();
  if (event.target.className === 'cart__item') cartItemClickListener(event);
  if (event.target.className.includes('search-button')) launchFetch(searchInput.value);
});

window.onload = function onload() {
  loadCart();
  sumPrice();
  launchFetch('computador');
}; // End of window load
