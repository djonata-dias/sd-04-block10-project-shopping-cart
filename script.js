let cartIds = [];

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  saveCart(event.target.id, false);
  event.target.remove();

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getElementWithCallback({ id, title, price, thumbnail }, callback) {
  const obj = {
    sku: id,
    name: title,
    salePrice: price,
    image: thumbnail,
  };
  return callback(obj);
}

async function appendCartItemById(id) {
  const cartList = document.querySelector('.cart__items');
  try {
    const fetched = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const jsonResult = await fetched.json();
    await cartList.appendChild(
      getElementWithCallback(jsonResult, createCartItemElement));
    saveCart(jsonResult.id, true);
  } catch (error) {
    console.log(error);
  }
}

function produtItemCLickListener(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  appendCartItemById(id);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', produtItemCLickListener);
  section.appendChild(button);

  return section;
}

function saveCart(id, addToList) {
  if (addToList) {
    cartIds.push(id);
  } else {
    cartIds = cartIds.filter(elem => elem !== id);
  }
  window.localStorage.cartIds = JSON.stringify(cartIds);
}

function loadCart() {
  if (!window.localStorage.cartIds) return;
  const ids = JSON.parse(window.localStorage.cartIds);
  ids.forEach(id => appendCartItemById(id));
}

window.onload = async () => {
  loadCart();
  const itemsList = document.querySelector('.items');
  try {
    const fetched = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const jsonResult = await fetched.json();
    await jsonResult.results.forEach((product) => {
      itemsList.appendChild(getElementWithCallback(product, createProductItemElement));
    });
  } catch (error) {
    console.log(error);
  }
};
