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

const toLocalStorage = () => { // Function to send products list to local storage
  const list = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_products', list);
};

const totalPrice = () => { // Sum price values from the cart list
  const cartItems = document.querySelector('.cart__items');
  const totalSpan = document.querySelector('.total-price');
  const priceArr = [];
  let total = 0;

  const list = cartItems.children;
  for (let i = 0; i < list.length; i += 1) {
    const itemArr = list[i].innerText.split(' ');
    const price = itemArr[itemArr.length - 1];
    const number = Number(price.substring(1));
    priceArr.push(number);
  }
  total = priceArr.reduce((acc, curr) => acc + curr, 0);
  totalSpan.innerHTML = total;
};

function cartItemClickListener(event) { // Removing cart item by clicking it
  event.target.remove();
  toLocalStorage();
  totalPrice();
}

const toGetLocalStorage = () => { // Get saved list from local storage
  const getList = localStorage.getItem('cart_products');
  document.querySelector('.cart__items').innerHTML = getList; // Adding items to current list
  const cart = document.querySelector('.cart__items'); // Making the items clickable again
  cart.addEventListener('click', cartItemClickListener);
};

const emptyCart = () => { // Function to delete all items form the cart at once
  const emptyCartBtt = document.querySelector('.empty-cart');
  emptyCartBtt.addEventListener('click', () => {
    const itemsList = document.querySelector('.cart__items');
    itemsList.innerHTML = '';
    toLocalStorage();
    totalPrice();
  });
};

function createCartItemElement({ sku, name, salePrice }) { // Function to insert item in the cart
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Function to create the item object as required, with sku, name and salePrice
const newCartItem = (itemObj) => {
  const cartItems = document.querySelector('.cart__items');
  const { id, title, price } = itemObj;
  const item = {
    sku: id,
    name: title,
    salePrice: price,
  };
  cartItems.appendChild(createCartItemElement(item));
  totalPrice();
};

function createProductItemElement({ sku, name, image }) { // Creating the list of available products
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'); // Adding event to product button to put this item in the cart
  button.addEventListener('click', (e) => {
    const clickedItemSku = e.target.parentNode.firstChild.innerText;

    fetch(`https://api.mercadolibre.com/items/${clickedItemSku}`)
    .then(response => response.json())
    .then(json => newCartItem(json)) // Callback function to put clicked item in the cart
    .then(() => toLocalStorage());
  });

  section.appendChild(button);
  return section;
}

const productsList = (productArray) => {
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 3000);

  const items = document.getElementsByClassName('items');
  productArray.forEach(({ id, title, thumbnail }) => {
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    items[0].appendChild(createProductItemElement(item));
  });
};

const firstFetch = () => {
  const $QUERY = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`)
    .then(response => response.json())
    .then(json => productsList(json.results))
    .catch(() => console.log('Hi there, an error just happened'));
};

window.onload = function onload() {
  firstFetch();
  emptyCart();
  toGetLocalStorage();
  totalPrice();
};
