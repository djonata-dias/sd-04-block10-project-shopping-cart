/* eslint-disable object-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable arrow-parens */
const mainSection = document.querySelector('.items');
const cartSection = document.querySelector('.cart__items');

const productInfo = (products) =>
  products.map(({ id, title, thumbnail, price }) => {
    const obj = {
      sku: id,
      name: title,
      image: thumbnail,
      salePrice: price,
    };
    return obj;
  });

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

// removing itens from the cart by clicking on them:
function cartItemClickListener(event) {
  event.target.remove();
}

// creating elements from each rom each item:
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// adding items to cart by clicking their buttons:
mainSection.addEventListener('click', function (event) {
  if (event.target.classList.contains('item__add')) {
    const itemID = event.target.parentNode.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
      .then((data) => data.json())
      .then((products) => cartSection.appendChild(createCartItemElement(products)));
  }
});

window.onload = function onload() {
  const queryInput = document.querySelector('.query-input').value;
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryInput}`)
    .then((data) => data.json())
    .then((json) => json.results)
    .then((products) => productInfo(products)
      .forEach((product) => mainSection.appendChild(createProductItemElement(product))));
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
