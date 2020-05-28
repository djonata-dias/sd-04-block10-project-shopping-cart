

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

// function cartItemClickListener(e) {
  // createCartItemElement({sku, name, salePrice})
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCart = async (e) => {
  const targetId = await getSkuFromProductItem(e.target.parentNode);
  const itemApi = await (await fetch(`https://api.mercadolibre.com/items/${targetId}`)).json();
  await Object.values(itemApi).forEach(({ id, title, price }) => {
    createCartItemElement({ sku: id, name: title, salePrice: price });
  });
};

const fetchAPI = async () => {
  const productsSection = document.querySelector('.items');
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  await console.log(data.results);
  await Object.values(data.results).forEach(({ id, title, thumbnail }) => {
    const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
    productsSection.appendChild(product);
  });
};


window.onload = async () => {
  await fetchAPI();
  const itemsButtom = document.getElementsByClassName('item__add');
  await itemsButtom.forEach(item => item.addEventListener('click', addCart(e)));
};
