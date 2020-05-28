function addObjCarrino(obj) {
  const { id: sku, title: name, price: salePrice } = obj;
  return { sku, name, salePrice };
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

/* Armazena carrinho no localStorage*/
function salvaCarrinho() {
  const items = document.querySelector('ol.cart__items').textContent;
  localStorage.setItem('carrinho', JSON.stringify(items, null, '-- -'));
}

async function updatePrice() {
  let totalPrice = 0;
  const cartList = await document.querySelectorAll('.cart__items .cart__item');
  const cartTotalPrice = await document.querySelector('.total-price');
  await cartList.forEach((item) => {
    const itemArray = item.innerHTML.split(' ');
    const itemPrice = +itemArray[itemArray.length - 1].replace('$', '');
    totalPrice += itemPrice;
  });
  cartTotalPrice.innerText = await +totalPrice.toFixed(2);
}

function cartItemClickListener(event) {
  /* coloque seu código aqui */
  event.target.remove();
  salvaCarrinho();
  updatePrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCarrinho(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => data)
    .then(addObjCarrino)
    .then(createCartItemElement)
    .then(item => document.querySelector('ol.cart__items').appendChild(item))
    .then(itens => salvaCarrinho(itens)) /* Salva o carrinho no localStorage*/
    .then(itens2 => updatePrice(itens2)); /* Soma os preços*/
}

function createCustomElement(element, className, innerText, id = null) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', function () {
      addCarrinho(id);
      /* added this line*/
    });
  }
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

function getAllProdutos(data) {
  const produtos = data;
  produtos.map((e) => {
    const obj = { sku: e.id, name: e.title, salePrice: e.price, image: e.thumbnail };
    document.getElementById('items').appendChild(createProductItemElement(obj));
    return produtos;
  });
}

function limpaCarrinho() {
  document.querySelector('ol.cart__items').innerHTML = ' ';
  salvaCarrinho();
  updatePrice();
}

function loading() {
  const lendo = document.querySelector('.loading');
  lendo.innerText = 'loading...';
  return lendo;
}

window.onload = function onload() {
  loading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => setTimeout(() => {
      getAllProdutos(data.results);
      /* Remove loading... */
      document.querySelector('.loading').remove();
    }, 3000));

  /* Veririca localStorage*/
  document.querySelector('ol.cart__items').innerHTML = localStorage.getItem('carrinho');
  document.querySelector('.empty-cart').addEventListener('click', limpaCarrinho);
};
