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

function setarTotal() {
  localStorage.setItem('totalsoma',
  document.querySelector('.total-price').innerHTML);
}

function setarLocal() {
  localStorage.setItem('cart_item',
  document.querySelector('.cart__items').innerHTML);
}

async function sub(event) {
  const totalSub = document.getElementsByClassName('total-price')[0];
  totalSub.innerHTML = parseFloat(totalSub.innerHTML) -
  parseFloat(event.target.innerHTML.substring(event.target.innerHTML.indexOf('$') + 1));
  return totalSub.innerHTML;
}

function cartItemClickListener(event) {
  event.target.remove();
  sub(event);
  setarLocal();
  setarTotal();
}

async function soma(a) {
  const totall = document.getElementsByClassName('total-price')[0];
  totall.innerHTML = parseFloat(totall.innerHTML) + parseFloat(a);
  return totall.innerHTML;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function eventBotao() {
  const b = document.getElementsByClassName('empty-cart')[0];
  b.addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = ' ';
    localStorage.clear();
    document.getElementsByClassName('total-price')[0].innerHTML = 0;
  });
}

function tratarClick(event) {
  const listaSegunda = {};
  const itemId = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then(response => response.json())
  .then((data) => {
    listaSegunda.sku = data.id;
    listaSegunda.name = data.title;
    listaSegunda.salePrice = data.price;
    const produtoCart = createCartItemElement(listaSegunda);
    document.querySelector('.cart__items').appendChild(produtoCart);
    setarLocal();
    soma(listaSegunda.salePrice);
    setarTotal();
  });
}

const receberDados = ((dados) => {
  const listaProdutos = {};
  dados.forEach((dado) => {
    listaProdutos.sku = dado.id;
    listaProdutos.name = dado.title;
    listaProdutos.image = dado.thumbnail;
    const produto = createProductItemElement(listaProdutos);
    document.querySelector('.items').appendChild(produto);
  });
  document.querySelectorAll('.item__add').forEach(e => e.addEventListener('click', event => tratarClick(event)));
});

function novoEvento() {
  const novoRemov = document.querySelectorAll('li');
  novoRemov.forEach(x => x.addEventListener('click', (event) => {
    event.target.remove();
    sub(event);
    setarLocal();
    setarTotal();
  }));
}

const getLocal = () => {
  const carrinho = document.getElementsByClassName('cart__items')[0];
  carrinho.innerHTML = localStorage.getItem('cart_item');
  novoEvento();
};

const getTotal = () => {
  const totalS = document.getElementsByClassName('total-price')[0];
  totalS.innerHTML = localStorage.getItem('totalsoma');
};

window.onload = function onload() {
  const span = document.getElementsByClassName('container')[0];
  span.appendChild(createCustomElement('span', 'loading', 'loading...'));
  setTimeout(() => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => receberDados(data.results))
    .catch(console.error);
    document.getElementsByClassName('loading')[0].remove();
  }, 2700);
  getLocal();
  eventBotao();
  getTotal();
};
