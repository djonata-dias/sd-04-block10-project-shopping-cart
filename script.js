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

function storeCart() {
  // To be improved must use Json
  const cartListOl = document.getElementsByClassName('cart__items');
  localStorage.setItem('cartItem', cartListOl[0].innerHTML);
}

async function sumPrice() {
  // Must improved and refracted
  const cartListOl = document.getElementsByClassName('cart__items');
  console.log('cartListOl BEGIN', cartListOl[0]);
  console.log('cartListOl BEGIN ineer', cartListOl[0].innerText);
  const cartListLi = document.querySelectorAll('.cart__item');
  sum = 0;
  for (let index = 0; index < cartListLi.length; index += 1) {
    console.log('index', index, cartListLi[index].innerText);
    const s = cartListLi[index].innerText;
    const splited = s.split('$');
    console.log('splited', splited[1]);
    // const extracted = (splited[2].match(/\d+/g) || []).map(n => parseInt(n));
    const extracted = parseFloat(splited[1]);
    console.log('extrated', extracted);
    sum += extracted;
    console.log('sum', sum);
  }
  console.log('temp message sumPrice', sum);
  const spanTotaPrice = document.querySelector('.total-price');
  // spanTotaPrice.innerText = `Total R$ ${sum}`;
  spanTotaPrice.innerText = sum;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  sumPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Fetch to call the infomation related to Id and call createCartItemElemen
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
    storeCart();
    sumPrice();
  })
    .catch(error => console.log(error));
}

async function createCartAsync(idToFecth) {
  await fetchId(idToFecth);
  sumPrice();
}

function removeCartItems() {
  const cartListOl = document.getElementsByClassName('cart__items');
  while (cartListOl[0].firstChild) {
    cartListOl[0].removeChild(cartListOl[0].firstChild);
  }
  storeCart();
  sumPrice();
}

function loadCart() {
  // To be improved
  console.log(localStorage.getItem('cartItem'));
  const cartListOl = document.getElementsByClassName('cart__items');
  cartListOl[0].innerHTML = localStorage.getItem('cartItem');
}
const query = 'computador';
const sectionItems = document.getElementsByClassName('items');
const containerElement = document.getElementsByClassName('cart');
const span = document.createElement('span');
span.innerText = 'loading...';
span.className = 'loading';
window.onload = function onload() {
  loadCart();
  sumPrice();
  containerElement[0].appendChild(span);
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        sectionItems[0].appendChild(
          createProductItemElement({
            sku: result.id, name: result.title, image: result.thumbnail }));
      });
      span.innerText = '-';
    })
    .catch(error => console.log(error));
  document.body.addEventListener('click', function (event) {  // find the Id of the clicked add to cart button
    console.log(event.target.className); // to remove
    if (event.target.className === 'item__add') {
      createCartAsync(
        event.target.previousSibling.previousSibling.previousSibling.innerText,
      ); // To be improved
    }
    if (event.target.className === 'empty-cart') removeCartItems();
  });
}; // End of window load
