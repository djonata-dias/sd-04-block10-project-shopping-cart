const searchApiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const itemApiUrl = 'https://api.mercadolibre.com/items/';

/* LocalStorage functions */
const updateCart = (data) => {
  let lastId = 0;
  Object.keys(localStorage).forEach((key) => {
    if (key >= lastId) lastId = key;
  });
  const nextId = Number(lastId) + 1;
  localStorage.setItem(nextId, JSON.stringify(data));
};

const getCartItems = () => Object.keys(localStorage).sort()
  .map((key) => JSON.parse(localStorage[key]));

const deleteCartItem = async (id) => {
  Object.keys(localStorage).forEach((key) => {
    if (JSON.parse(localStorage[key]).sku === id) localStorage.removeItem(key);
  });
};

const cleanCartItems = async () => localStorage.clear();

/* endof */

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const isLoading = (status) => {
  if (status) {
    const loadingElement = createCustomElement('span', 'loading', 'loading...');
    document.querySelector('.items').appendChild(loadingElement);
  } else {
    document.querySelector('.loading').remove();
  }
};

const calculateTotal = () => {
  const total = getCartItems()
    .reduce((sum, { salePrice }) => sum + salePrice, 0);
  document.querySelector('.total-price').textContent = '1099.9';
};

function cartItemClickListener(event) {
  deleteCartItem(event.target.id)
    .then(() => {
      event.target.remove();
      calculateTotal();
    });
}

const cleanCart = () => {
  // Remove from localStorage
  cleanCartItems()
    .then(() => {
      document.querySelectorAll('.cart__item')
        .forEach((item) => item.remove());
      calculateTotal();
    });
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductToCart = async (productElement) => {
  fetch(itemApiUrl + getSkuFromProductItem(productElement))
    .then((response) => response.json())
    .then((data) => {
      const productData = { sku: data.id, name: data.title, salePrice: data.price };
      updateCart(productData);
      return productData;
    })
    .then((productData) => {
      document.querySelector('.cart__items').appendChild(
        createCartItemElement(productData),
      );
      calculateTotal();
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.children[3].addEventListener('click', () => addProductToCart(section));

  return section;
}

const searchProducts = async (search) => {
  isLoading(true);

  fetch(searchApiUrl + search)
    .then((response) => response.json())
    .then((data) => {
      setTimeout(() => {
        isLoading(false);
      }, 3000);
      data.results.forEach((item) => {
        const productData = { sku: item.id, name: item.title, image: item.thumbnail };
        const productElement = createProductItemElement(productData);

        document.querySelector('.items').appendChild(productElement);
      });
    });
};

const initApp = () => {
  const items = getCartItems();
  items.forEach((item) => {
    document.querySelector('.cart__items').appendChild(
      createCartItemElement(item),
    );
  });
  calculateTotal();
};

window.onload = function onload() {
  searchProducts();
  initApp();

  // Enable clean cart btn
  document.querySelector('.empty-cart')
    .addEventListener('click', () => cleanCart());
};
