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

const addToStorage = () => {
  const items = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('items', items);
};

async function totalPrice() {
  const items = document.querySelectorAll('.cart__item');
  const totalHtml = document.querySelector('.total-price');
  let total = 0;
  if (items.length !== 0) {
    items.forEach((item) => {
      const string = item.innerText.split('$')[1];
      total += parseFloat(string);
    });
  }

  totalHtml.innerText = Number.isInteger(total) ? Math.trunc(total) : total;
}


function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  addToStorage();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createObj = (data) => {
  const sku = data.id;
  const name = data.title;
  const image = data.thumbnail;
  const salePrice = data.price;
  return { sku, name, image, salePrice };
};

const addCarrinho = (data) => {
  const obj = createObj(data);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(obj));
  addToStorage();
  totalPrice();
};

const getItemsFromAPI = API_URL => fetch(API_URL).then(data => data.json());

const adicionaEventListener = () => {
  const product = document.querySelectorAll('.item');
  product.forEach((item) => {
    item.lastElementChild.addEventListener('click', () => { // lastElemntChild é o botão que recebe o eventLIstener
      getItemsFromAPI(`https://api.mercadolibre.com/items/${item.firstElementChild.innerHTML}`)
      .then(data => addCarrinho(data))
      .catch(error => console.log(error));
    });
  });
};

const trataDadosJson = (data) => {
  data.results.forEach((product) => {
    const obj = createObj(product);
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(obj));
  });
  adicionaEventListener();
  // chama a função que adiciona os event listeners para todos os elementos
};

const esvaziarCarrinho = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const itemsCarrinho = document.querySelectorAll('.cart__item');
    itemsCarrinho.forEach(item => item.remove());
    addToStorage();
    totalPrice();
  });
};

const loadCart = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('items');
  const arrayDeLi = document.querySelectorAll('.cart__item');
  arrayDeLi.forEach(li => li.addEventListener('click', cartItemClickListener));
  esvaziarCarrinho();
  totalPrice();
};

window.onload = function onload() {
  loadCart();
  const query = 'computador';
  const apiItems = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  // const section = document.querySelector('.items');
  // section.appendChild(createCustomElement('span', 'loading', 'loading...'));
  setTimeout(() => {
    getItemsFromAPI(apiItems)
    .then(dataJson => trataDadosJson(dataJson))
    .then(() => document.querySelector('.loading').remove())
    .catch(error => console.log(error));
  }, 1000);
  // getItemsFromAPI(apiItems)
  // .then(data => data.json())
  // .then(dataJson => trataDadosJson(dataJson))
  // .then(() => document.querySelector('.loading').remove())
  // .catch(error => console.log(error));
  // getItemsFromAPI(apiItems)
  //   .then(data => data.json())
  //   .then(dataJson => trataDadosJson(dataJson))
  //   .catch(error => console.log(error));
};
