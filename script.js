const shopCart = document.querySelector('.cart__items');
const shopCartTotal = document.querySelector('.total-price');

async function updatePrice() {
  let totalPrice = 0;
  const i = document.querySelectorAll('.cart__item');
  await i.forEach((item) => {
    const itemArray = item.innerHTML.split(' ');
    const itemPrice = +itemArray[itemArray.length - 1].replace('$', '');
    totalPrice += +itemPrice;
  });
  shopCartTotal.innerHTML = totalPrice;
}

function setStorage() {
  const string = JSON.stringify(shopCart.innerHTML);
  localStorage.setItem('shopCart', string);
}

function clear() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    while (shopCart.lastElementChild) {
      shopCart.removeChild(shopCart.lastElementChild);
    }
    setStorage();
    updatePrice();
  });
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  console.log('!');
  event.target.remove();
  setStorage();
  updatePrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addToCart = async (event) => {
  const targetButton = event.target;
  const itemId = getSkuFromProductItem(targetButton.parentNode);
  const itemIdQuery = await (await fetch(`https://api.mercadolibre.com/items/${itemId}`)).json();
  const itemLi = await createCartItemElement({
    sku: itemIdQuery.id,
    name: itemIdQuery.title,
    salePrice: itemIdQuery.price,
  });
  shopCart.appendChild(itemLi);
  setStorage();
  updatePrice();
};

const addButton = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach(item => item.addEventListener('click', addToCart));
};

function getStorage() {
  shopCart.innerHTML = JSON.parse(localStorage.getItem('shopCart'));
  const i = document.querySelectorAll('.cart__item');
  i.forEach(item => item.addEventListener('click', cartItemClickListener));
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function createItemObject(array) {
  const productsSection = document.querySelector('.items');
  array.forEach((item) => {
    const product = createProductItemElement({
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    });
    productsSection.appendChild(product);
  });
}

function addLoader() {
  const loading = document.createElement('p');
  loading.classList.add('loading');
  loading.innerText = 'loading...';
  const itemsSection = document.querySelector('.items');
  itemsSection.appendChild(loading);
}

function removeLoader() {
  const itemsSection = document.querySelector('.items');
  itemsSection.removeChild(document.querySelector('.loading'));
}

const computerQuery = async () => {
  addLoader();
  const query = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonResult = await query.json();
  const queryResults = await jsonResult.results;
  await setTimeout(removeLoader, 1500);
  await createItemObject(queryResults);
};

window.onload = async () => {
  await computerQuery();
  await addButton();
  await clear();
  await getStorage();
  updatePrice();
};
