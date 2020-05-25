const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement(
    'img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

const productList = (array) => {
  const items = document.querySelector('.items');
  array.forEach((product) => {
    const { id, title, thumbnail } = product;
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };

    items.appendChild(createProductItemElement(item));
  });
};

/* const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  // coloque seu código aqui
}

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */


window.onload = () => {
  const query = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch(API_URL, myObject)
    .then(response => response.json())
    .then(data => productList(data.results))
    .catch(() => console.log('error'));
};
