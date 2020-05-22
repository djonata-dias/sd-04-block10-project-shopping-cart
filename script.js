function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function addToCartObj(obj) {
  const { id: sku, title: name, price: salePrice } = obj;
  return { sku, name, salePrice };
}

function addToCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => data)
    .then(addToCartObj)
    .then(createCartItemElement)
    .then(item => document.querySelector('ol.cart__items').appendChild(item));
}

function createCustomElement(element, className, innerText, id = null) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', () => {
      addToCart(id);
    }); // added this line
  }
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
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku),
  );
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function listItems(array) {
  const sectionItems = document.querySelector('section.items');
  array.forEach((computerObj) => {
    const { id: sku, title: name, thumbnail: image } = computerObj;
    const newObj = { sku, name, image };
    sectionItems.appendChild(createProductItemElement(newObj));
  });
}

const fetchList = () => {
  const myObj = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObj)
    .then(response => response.json())
    .then(data => data.results)
    .then(listItems);
};

window.onload = function onload() {
  fetchList();
};
