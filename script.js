
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

function setCart() {
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_list', cartList);
}

function cartItemClickListener(event) {
  event.target.remove();
  setCart();
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
          })));
    setCart();
  });
  section.appendChild(btnAdd);

  return section;
}

function getCart() {
  const savedCartList = localStorage.getItem('cart_list');
  document.getElementsByClassName('cart__items').innerHTML = savedCartList;
  const cartList = document.querySelector('.cart__items');
  cartList.addEventListener('click', cartItemClickListener);
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
  getCart();
};
