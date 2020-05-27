
function searchProduct(product) {
  return `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
}

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


/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  btnAdd.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(data => data.json())
      .then(product =>
        document.getElementsByClassName('cart__items')[0].appendChild(
          createCartItemElement({
            sku: product.id,
            name: product.title,
            salePrice: product.price,
          }),
        ));
  });
  section.appendChild(btnAdd);

  return section;
}

window.onload = function onload() {
  fetch(searchProduct('computador'))
  .then(data => data.json())
  .then((json) => {
    json.results.forEach((product) => {
      document.querySelector('.items').appendChild(
        createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        }),
      );
    });
  });
};
