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

async function SomaPrice() {
  const prices = await document.querySelector('.total-price');
  const cart = await document.querySelector('.cart__items');
  const allPrices = [];
  let totalPrices = 0;
  let pegaInner = [];

  await cart.childNodes.forEach((element) => {
    pegaInner = element.innerHTML.split(' ');
    const aux = pegaInner[pegaInner.length - 1].replace('$', '');
    allPrices.push(parseFloat(aux));
  });
  totalPrices = await allPrices.reduce((acc, price) => acc + price, 0);
  prices.innerHTML = await totalPrices;
}

const save = () => {
  const cart = document.querySelector('.cart__items');
  let contadorStore = 0;

  cart.childNodes.forEach((element) => {
    localStorage.setItem(`id ${contadorStore}`, `${element.innerHTML}`);
    contadorStore += 1;
  });
  localStorage.setItem('tamanho', `${contadorStore}`);
};

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
  localStorage.clear();
  save();
  SomaPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => cartItemClickListener(event));
  return li;
}

const buscaEAplica = (busca, entrada) => {
  const opc = { sku: entrada.id, name: entrada.title, salePrice: entrada.price };

  document.querySelectorAll(busca)[0]
  .appendChild(createCartItemElement(opc));
  save();
  SomaPrice();
};

const addButtomCard = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(otherData => otherData.json())
  .then(otherDataJson => buscaEAplica('.cart__items', otherDataJson))
  .catch(error => console.log(error));
};

function createProductItemElement({ sku, name, image }) {
  const butt = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  butt.addEventListener('click', () => addButtomCard(sku));
  section.appendChild(butt);

  return section;
}

const resumeData = (dataJson) => {
  const arrayDeProdutos = dataJson.results;

  arrayDeProdutos.forEach((element) => {
    document.querySelectorAll('.items')[0]
    .appendChild(createProductItemElement({
      sku: element.id, name: element.title, image: element.thumbnail }));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const reconstroiCart = (indice) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = localStorage.getItem(`id ${indice}`);
  li.addEventListener('click', () => cartItemClickListener(event));
  return li;
};

const load = () => {
  const tamanho = localStorage.getItem('tamanho');
  for (let i = 0; i < tamanho; i += 1) {
    document.querySelectorAll('.cart__items')[0]
    .appendChild(reconstroiCart(i));
  }
  SomaPrice();
};

const limpaCart = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  save();
  SomaPrice();
};

const addLoading = (pai) => {
  const loading = document.createElement('section');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  pai.appendChild(loading);
};

const iniciar = () => {
  const pai = document.querySelector('.container');
  addLoading(pai);
  setTimeout(() => {
    pai.removeChild(pai.lastChild);
  }, 1000);
  const apagarCart = document.querySelector('.empty-cart');
  apagarCart.addEventListener('click', () => limpaCart());
  load();
};

window.onload = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(data => data.json())
  .then(dataJson => resumeData(dataJson))
  .catch(error => console.log(error));
  iniciar();
};
