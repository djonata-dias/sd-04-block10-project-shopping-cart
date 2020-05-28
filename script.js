const shopCart = document.querySelector('.cart__items');

function clear() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    while (shopCart.lastElementChild) {
      shopCart.removeChild(shopCart.lastElementChild);
    }
  });
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
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
};

const addButton = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach(item => item.addEventListener('click', addToCart));
};

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

const computerQuery = async () => {
  const query = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonResult = await query.json();
  const queryResults = await jsonResult.results;
  await createItemObject(queryResults);
};

window.onload = async () => {
  await computerQuery();
  await addButton();
  await clear();
};
