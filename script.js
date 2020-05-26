const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

// const getSkuFromProductItem = (item) =>
//   item.querySelector('span.item__sku').innerText;

const cartItemClickListener = event => event.target.remove();

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementsByClassName('cart__items')[0].appendChild(li);
  localStorage.cart = document.querySelector('ol.cart__items').innerHTML;
  return li;
};

const infoProduct = (event) => {
  const itemID = event.target.parentNode.firstChild.innerText;
  fetch(`http://api.mercadolibre.com/item/${itemID}`)
    .then(response => response.json())
    .then(data => createCartItemElement({ sku: data.id, name: data.title, sale: data.price }))
    .catch(console.error);
};

const productInfo = (results) => {
  const product = {};
  results.forEach((item) => {
    product.sku = item.id;
    product.name = item.title;
    product.image = item.thumbnail;
    const div = createProductItemElement(product);
    document.getElementsByClassName('items')[0].appendChild(div);
  });
  document.querySelectorAll('.item__add')
    .forEach((item) => {
      item.addEventListener('click', event => infoProduct(event));
    });
};

const fetchAPI = (URL) => {
  fetch(URL)
  .then(response => response.json())
  .then(data => productInfo(data.results))
  .catch(console.error);
};

const clearCart = () => {
  if (Storage) {
    document.querySelector('ol.cart__items').innerHTML = localStorage.cart;
  }
  document.querySelector('button.empty-cart').addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    localStorage.cart = '';
    totalPrice();
  });
};

const loadingTxt = () => document
  .getElementsByClassName('top-bar')[0]
  .appendChild(createCustomElement('span', 'loading', 'loading...'));

window.onload = function onload() {
  fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  this.setTimeout(() => document.querySelectorAll('.loading').remove(), 100);
  clearCart();
  loadingTxt();
};
