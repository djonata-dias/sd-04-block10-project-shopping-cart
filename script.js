const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const getCartItems = document.getElementsByClassName('cart__items');

async function fetchAPI(url) {
  const response = await fetch(url);
  const responseJson = await response.json();
  return responseJson;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

//  Requirement 5

const sumPrice = async () => {
  const getItem = document.querySelectorAll('.cart__item');
  let totalPrice = 0;
  getItem.forEach(
    item => (totalPrice += parseFloat(item.innerText.split('$')[1])),
  );
  document.querySelector('.total-price').innerText = totalPrice;
};

//  Requirement 4

const salveCartLocalStorage = () => {
  localStorage.setItem('cartItems', getCartItems[0].innerHTML);
};

/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

//  Requirement 3

function cartItemClickListener(event) {
  event.target.remove();
  salveCartLocalStorage();
  sumPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requirement 2

const addProductByCart = async ({ sku }) => {
  const skuJson = await fetchAPI(`https://api.mercadolibre.com/items/${sku}`);
  getCartItems[0].appendChild(
    createCartItemElement({
      sku: skuJson.id,
      name: skuJson.title,
      salePrice: skuJson.price,
    }),
  );
  salveCartLocalStorage();
  sumPrice();
};

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
  const buttonAddCart = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  buttonAddCart.addEventListener('click', () => addProductByCart({ sku }));
  section.appendChild(buttonAddCart);
  return section;
}

//  Requirement 1

const createList = async () => {
  const urlJson = await fetchAPI(API_URL);
  const items = document.querySelector('.items');
  urlJson.results.map(function (data) {
    return items.appendChild(
      createProductItemElement({
        sku: data.id,
        name: data.title,
        image: data.thumbnail,
      }),
    );
  });
  setTimeout(() => {
    document.getElementsByClassName('loading')[0].remove(); //  7
  }, 500);
};

//  Requeriment 3, 4 and 6

window.onload = async function onload() {
  await createList();
  await sumPrice();

  document
    .getElementsByClassName('empty-cart')[0]
    .addEventListener('click', () => {
      localStorage.setItem('cartItems', ''); //  4
      getCartItems[0].innerHTML = ''; //  6
    });

  getCartItems[0].innerHTML = localStorage.getItem('cartItems'); //  4
};
