// --- Embeddeds

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function takeItemCartApi(url) { // c
  try {
    const prom = await fetch(url);
    const resJson = await prom.json();
    const { id: sku, title: name, price: salePrice } = resJson;
    const o = { sku, name, salePrice };
    document.querySelector('.cart__items').appendChild(createCartItemElement(o));
  } catch (er) {
    console.log(er);
  }
}

const addCart = (e) => { // c
  const parent = e.target.parentNode; // retorna o pai do el clicado
  const id = getSkuFromProductItem(parent); // retorna o id do el clicado
  takeItemCartApi(`https://api.mercadolibre.com/items/${id}`); // retorna os dados do item via API
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (className === 'item__add') e.addEventListener('click', addCart); // +
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

// --- Fim embeddeds

const createRemoveLoading = () => {
  const elP = document.createElement('p');
  elP.className = 'loading';
  elP.innerHTML = 'loading...';
  document.body.appendChild(elP);
  setTimeout(() => elP.remove(), 3000);
};

async function takeResultsApi(url) {
  try {
    const prom = await fetch(url);
    const resJson = await prom.json();
    resJson.results.forEach((item) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const o = { sku, name, image };
      document.querySelector('.items').appendChild(createProductItemElement(o));
    });
  } catch (er) {
    console.log(er);
  }
}

window.onload = function onload() {
  createRemoveLoading();
  takeResultsApi('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};
