const secItems = document.querySelector('.items'); // Manipula section items.
const carrinho = document.querySelector('.cart__items');
const API_END = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
let apiItem = '';

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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addToCart);
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (e) => {
  const id = event.target.parentNode.firstChild.innerText;
  apiItem = `https://api.mercadolibre.com/items/${id}`;
  fetch(apiItem)
  .then((responsta) => responsta.json())
  .then(({ id, title, thumbnail }) => {
    carrinho.append(createCartItemElement({ sku: id, name: title, image: thumbnail }));
  })
  .catch((error) => console.log(error));
};

const pegaObjetaoEItera = (obj) => {
  obj.forEach(({ id, title, thumbnail }) => {
    secItems.append(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
};

window.onload = function onload() {
  fetch(API_END)
  .then(responsta => responsta.json())
  .then(json => pegaObjetaoEItera(json.results))
  .catch(error => console.log(error));
};
