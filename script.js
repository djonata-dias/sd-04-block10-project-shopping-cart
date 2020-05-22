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
  button.addEventListener('click', (e) => {
    const clickedItemSku = e.target.parentNode.firstChild.innerText;

    fetch(`https://api.mercadolibre.com/items/${clickedItemSku}`)
    .then(response => response.json())
    .then(json => itemInfo(json));
  });

  section.appendChild(button);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  const clickedCartItem = event.target;
  cart.removeChild(clickedCartItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const itemInfo = (itemObj) => {
  const cartItems = document.querySelector('.cart__items');

  const { id, title, price } = itemObj;
  const item = {
    sku: id,
    name: title,
    salePrice: price,
  };

  cartItems.appendChild(createCartItemElement(item));

};

const productInfo = (productArray) => {
  const items = document.getElementsByClassName('items');

  productArray.forEach((product) => {
    const { id, title, thumbnail } = product;
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };

    items[0].appendChild(createProductItemElement(item));

  });
};

const firstFetch = () => {
  const $QUERY = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${$QUERY}`)
    .then(response => response.json())
    .then(json => productInfo(json.results))
    .catch(err => console.log("Hi there, an error just happened"))
};

window.onload = function onload() {
  firstFetch();
};
