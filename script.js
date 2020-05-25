
const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
  button.addEventListener('click', (event) => {
    const item = getSkuFromProductItem(event.target.parentElement);
    fetch(`https://api.mercadolibre.com/items/${item}`)
      .then(response => response.json())
      .then(data => {
        receberDadosCart(data);
      });
  });
  section.appendChild(button);
  return section;
}

function receberDadosCart(data) {
  const dados = data;
  createCartItemElement({sku: data.id, name: data.title, salePrice: data.price}) //{ sku, name, salePrice }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const ol= document.querySelector('.cart__items');
  ol.appendChild(li);
  return li;
}


function receberDados(data) {
  const lista = data;
  lista.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement({ sku, name, image }));
  });
}

window.onload = function onload() {
  fetch(url)
    .then(response => response.json())
    .then(data => receberDados(data.results));
};

