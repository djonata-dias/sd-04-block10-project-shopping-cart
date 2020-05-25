window.onload = function onload() { };

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const totalPrice = async () => {
  const cartItems = document.querySelector('.cart__items');
  const totalSpan = document.querySelector('.total-price');
  const priceArr = [];
  let total = 0;

  const list = cartItems.children;
  for (let i = 0; i < list.length; i += 1) {
    const itemArr = list[i].innerText.split(' ');
    const notTratedValue = itemArr[itemArr.length - 1];
    const tratedValue = Number(notTratedValue.substring(1));
    priceArr.push(tratedValue);
  }
  total = priceArr.reduce((acc, curr) => acc + curr, 0);
  totalSpan.innerHTML = total;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  // const cartElement = document.querySelector('ol.cart__items');
  // cartElement.removeChild(event.target);
  event.target.remove();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const funcObjToCart = (data) => {
  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(obj));
  totalPrice();
};

function limpaCarrinho() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  totalPrice();
}
const addCartListener = () => {
  const nodeItems = document.querySelectorAll('.item');
  nodeItems.forEach((element) => {
    element.lastElementChild.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${element.firstElementChild.innerHTML}`)
        .then(response => response.json())
        .then(data => funcObjToCart(data))
        .catch(error => console.log(error));
    });
  });

  const btnClear = document.querySelector('.empty-cart');
  btnClear.onclick = limpaCarrinho;
};
const funcObjectToList = (data) => {
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 3000);
  data.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement({ sku, name, image }));
  });
  addCartListener();
  limpaCarrinho();
};

const callAPI = async () => {
  try {
    const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$jogos';
    fetch(API_URL)
      .then(response => response.json())
      .then(data => funcObjectToList(data.results))
  } catch (error) {
    console.log(error);
  }
};

callAPI();
