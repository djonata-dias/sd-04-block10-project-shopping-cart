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

function cartItemClickListener(event) {
  // coloque seu código aqui
  const selecionado = event.target;
  // selecionado.innerHTML = "";
  // const carrinho = document.querySelector('.cart_items');
  selecionado.parentNode.removeChild(selecionado);
}


function createCartItemElement({ sku, name, salePrice }) {
//  console.log(sku, name, salePrice)
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const convertObject = (dataArray) => {
  const itemClass = document.querySelector('.items');
  dataArray.forEach(({ id, title, thumbnail, price }) => {
    itemClass.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
    console.log(itemClass);
    itemClass.lastElementChild.addEventListener('click', (event) => {
      const choice = event.target;
      console.log(choice);
      const cartItems = document.querySelector('.cart__items');
      const itemCart = createCartItemElement({ sku: id, name: title, salePrice: price });
      cartItems.appendChild(itemCart);
//      cartItems.addEventListener('click', cartItemClickListener)
    });
  });
};

const getObject = (busca) => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

  fetch(API_URL + busca)
  .then(response => response.json())
  .then(data => convertObject(data.results));
};

getObject('Computador');
