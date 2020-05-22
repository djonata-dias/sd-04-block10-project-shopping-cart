//  Comment to commit
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

const updateCart = () => {
  localStorage.setItem(
    'Cart-items',
    document.querySelector('.cart__items').innerHTML,
  );
  sumPrices();
};

function cartItemClickListener(event) {
  event.target.remove();
  updateCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const sumPrices = () => {
//   const cartItems = document.querySelectorAll('.cart__item');
//   document.querySelector('total-price').textContent = Math.round([...cartItems]
//     .reduce((acc, price) => acc + parseFloat(price), 0) * 100) / 100;
// };

const loading = () =>
  document
    .getElementsByClassName('items')[0]
    .appendChild(createCustomElement('span', 'loading', 'LOADING...'));

// const removeLoading = () => {
//   document.getElementsByClassName('loading')[0].remove();
// };

const appendElement = (parentClass, callback, obj) =>
  document.getElementsByClassName(parentClass)[0].appendChild(callback(obj));

const addToCart = async ({ sku }) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then(product =>
      appendElement('cart__items', createCartItemElement, {
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      }),
    );
  await localStorage.setItem(
    'Cart-items',
    document.querySelector('.cart__items').innerHTML,
  );
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddProduct = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  btnAddProduct.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(btnAddProduct);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }Bora cypress 2

const clearCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.setItem('Cart-items', '');
  });
};

window.onload = function onload() {
  loading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(data => data.json())
    .then((json) => {
      setTimeout(() => {
        document.querySelector('.loading').remove();
      }, 2700);
      json.results.forEach((product) => {
        document.querySelectorAll('.items')[0].appendChild(
          createProductItemElement({
            sku: product.id,
            name: product.title,
            image: product.thumbnail,
          }),
        );
      });
    });
  clearCart();
  document.querySelector('.cart__items').innerHTML = localStorage.getItem(
    'Cart-items',
  );
  document
    .querySelectorAll('li')
    .forEach(li => li.addEventListener('click', cartItemClickListener));
};
