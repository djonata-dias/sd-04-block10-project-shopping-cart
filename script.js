const query = 'computador';
const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement(
    'img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

// const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;
const cartItemClickListener = (event) => {
  event.target.remove();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

// Requirement 1
// Create a product list
const productList = (array) => {
  const items = document.querySelector('.items');
  array.forEach((product) => {
    const { id, title, thumbnail } = product;
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    items.appendChild(createProductItemElement(item));
  });
};

// Requirement 2
// Create an object and append to the Cart Items OL
const addToCart = ({ id, title, price }) => {
  const cartElemenentObj = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const cartItemElement = createCartItemElement(cartElemenentObj);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(cartItemElement);
};

// Fetch the API
const fetchItem = (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then(data => addToCart(data))
    .catch(err => console.log(err));
};

// Get the item ID of clicked element
const getItemId = (e) => {
  const clickedItem = e.target.parentNode.firstChild.innerText;
  fetchItem(clickedItem);
};

// Create Event Listeners for all items on the list and run the GetItemId function
const clickedBtn = () => {
  const addBtn = document.querySelectorAll('.item__add');
  addBtn.forEach(button => button.addEventListener('click', getItemId));
};

window.onload = () => {
  fetch(API_URL, myObject)
    .then(response => response.json())
    .then(data => productList(data.results))
    .then(clickedBtn)
    .catch(() => console.log('error'));
};
