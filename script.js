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

const sumAll = async () => {
  const allItems = document.getElementsByClassName('cart__item');
  const totalPriceDisplay = document.querySelector('.total-price');
  totalPriceDisplay.textContent = [...allItems]
    .map(e => e.textContent.match(/([0-9.]){1,}$/))
    .reduce((acc, price) => acc + parseFloat(price), 0);
};

const updateCart = () => {
  localStorage.setItem(
    'Cart-items',
    document.getElementsByClassName('cart__items')[0].innerHTML,
  );
  sumAll();
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

const loading = () =>
  document
    .getElementsByClassName('items')[0]
    .appendChild(createCustomElement('span', 'loading', 'LOADING...'));

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
  sumAll();
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

const clearCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    sumAll();
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
