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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  addToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadCart = () => {
  const innerHtml = localStorage.getItem('items');
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = innerHtml;
  const arrayDeLi = document.querySelectorAll('.cart__item');
  arrayDeLi.forEach(li => li.addEventListener('click', cartItemClickListener));
};

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
};

const adicionaEventListener = () => {
  const product = document.querySelectorAll('.item');
  product.forEach((element) => {
    element.lastElementChild.addEventListener('click', () => { // lastElemntChild é o botão que recebe o eventLIstener
      fetch(`https://api.mercadolibre.com/items/${element.firstElementChild.innerHTML}`)
      .then(data => data.json())
      .then(dataJson => addCarrinho(dataJson))
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

window.onload = function onload() {
  loadCart();
  const query = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(API_URL)
    .then(data => data.json())
    .then(dataJson => trataDadosJson(dataJson))
    .catch(error => console.log(error));
};
