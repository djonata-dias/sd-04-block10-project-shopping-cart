const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const myObj = { method: 'GET' };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

//  Requirement 3

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requirement 2

const addProductByCart = async ({ sku }) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then((product) => {
      document.getElementsByClassName('cart__items')[0].appendChild(
        createCartItemElement({
          sku: product.id,
          name: product.title,
          salePrice: product.price,
        }),
      );
    });
};

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
  const buttonAddCart = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  buttonAddCart.addEventListener('click', () => addProductByCart({ sku }));
  section.appendChild(buttonAddCart);
  return section;
}

//  Requirement 1

const createList = async () => {
  await fetch(API_URL, myObj)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');
      data.results.map(function (dados) {
        return items.appendChild(
          createProductItemElement({
            sku: dados.id,
            name: dados.name,
            image: dados.thumbnail,
          }),
        );
      });
    });
};

window.onload = async function onload() {
  await createList();
  document
    .getElementsByClassName('empty-cart')[0]
    .addEventListener('click', () => {
      document.getElementsByClassName('cart__items')[0].innerHTML = '';
    });

  document.getElementsByClassName(
    'cart__items',
  )[0].innerHTML = localStorage.getItem('itemCart');

  document
    .querySelectorAll('li')
    .forEach(li => li.addEventListener('click', cartItemClickListener));
};
