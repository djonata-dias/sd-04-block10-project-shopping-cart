/* eslint-disable arrow-parens */
window.onload = function onload() {};
const queryButton = document.querySelector('.query-button');
const mainSection = document.querySelector('.items');

const productInfo = products => products
  .map((product) => {
    const obj = {};
    const { id, title, thumbnail } = product;
    obj.sku = id;
    obj.name = title;
    obj.image = thumbnail;
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

  return mainSection.appendChild(section);
}

const productsFetch = () => {
  const queryInput = document.querySelector('.query-input').value;
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryInput}`)
    .then(data => data.json())
    .then(json => json.results)
    .then(products => productInfo(products)
      .forEach(product => createProductItemElement(product)));
};
productsFetch();
queryButton.addEventListener('click', () => productsFetch());


// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
