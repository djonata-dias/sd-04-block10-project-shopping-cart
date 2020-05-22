let valor = 0;

async function doFetch(QUERY) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const resp = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const loadRemove = () => document.querySelector('.loading').remove();
  await new Promise(resolve => resolve(loadRemove()));
  const data = await resp.json();
  const newMap = data.results.map((obj) => {
    const filter = { sku: obj.id,
      name: obj.title,
      image: obj.thumbnail,
      salePrice: obj.price,
    };
    return filter;
  });
  return newMap;
}

async function doClick(ID) {
  const resp = await fetch(`https://api.mercadolibre.com/items/${ID}`);
  const data = await resp.json();
  const newObj = {
    sku: data.id,
    name: data.title,
    image: data.thumbnail,
    salePrice: data.price,
  };
  return newObj;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function storageUpdate() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('cartItemsKey', (cartItems.innerHTML));
}

function addValorTotal() {
  const totalPrice = document.querySelector('.total-price');
  const cartItems = document.querySelector('.cart__items');
  valor = Array.from(cartItems.children)
  .map(element => Number(element.id))
  .reduce((acc, cur) => acc + cur, 0);
  console.log(valor);
  if (Number.isInteger(valor) || valor === 0) {
    totalPrice.innerText = Math.trunc(valor);
  } else totalPrice.innerText = valor.toFixed(2);
}


function cartItemClickListener(e) {
  const totalPrice = document.querySelector('.total-price');
  valor -= e.target.id;
  totalPrice.innerText = valor.toFixed(2);
  e.target.remove();
  storageUpdate();
  addValorTotal();
}

function clearCart() {
  const totalPrice = document.querySelector('.total-price');
  valor = 0;
  totalPrice.innerText = valor;
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  storageUpdate();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function eventFunction(e) {
  return (getSkuFromProductItem(e.target.parentElement));
}

window.onload = async function onload() {
  const items = document.querySelector('.items');
  const sync = await doFetch('computador');
  sync.map(objeto => items.appendChild(createProductItemElement(objeto)));
  const cartItems = document.querySelector('.cart__items');

  if (localStorage.getItem('cartItemsKey')) {
    cartItems.innerHTML = localStorage.getItem('cartItemsKey').toString();
    valor = Array.from(cartItems.children)
      .map(element => Number(element.id))
      .reduce((acc, cur) => acc + cur);
    addValorTotal();
    cartItems.addEventListener('click', cartItemClickListener);
  }

  const buttons = Array.from(document.querySelectorAll('.item__add'));
  buttons.map(button => button.addEventListener('click', async (e) => {
    const id = await eventFunction(e);
    const clickado = await doClick(id);
    const itemAdded = createCartItemElement(clickado);
    cartItems.appendChild(itemAdded);
    storageUpdate();
    addValorTotal();
  }));

  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.onclick = clearCart;
};
