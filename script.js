
const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const lista = document.querySelector('.cart__items');

function addToStorage() {
  localStorage.setItem('lista', lista.innerHTML);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  addToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  addToStorage();
  return li;
}

function receberDadosCart(data) {
  createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (event) => {
    const item = getSkuFromProductItem(event.target.parentElement);
    fetch(`https://api.mercadolibre.com/items/${item}`)
      .then(response => response.json())
      .then((data) => {
        receberDadosCart(data);
      });
  });
  section.appendChild(button);
  return section;
}

function receberDados(data) {
  const list = data;
  list.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement({ sku, name, image }));
  });
}

window.onload = function onload() {
  lista.innerHTML = localStorage.getItem('lista');
  const listaArray = document.querySelectorAll('.cart__item');
  console.log(listaArray);
  listaArray.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  fetch(url)
    .then(response => response.json())
    .then(data => receberDados(data.results));
};
