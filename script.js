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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   event.target.remove();
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const productList = results => {
  const product = {};
  results.forEach((data) => {
    product.sku = data.it;
    product.name = data.title;
    product.image = data.thumbnail;
    const section = createProductItemElement(product);
    document.getElementsByClassName('items')[0].appendChild(section);
  });
}

const fetchAPI = (url) => {
  fetch(url)
  .then(response => response.json())
  .then((data) => productList(data.results))
};

window.onload = function onload() {
  fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');

};
