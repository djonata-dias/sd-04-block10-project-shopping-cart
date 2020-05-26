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

/*Armazena carrinho no localStorage*/
function salvaCarrinho() {
  const items = document.querySelector('.cart__items').textContent;
  localStorage.setItem('carrinho', items);
}

function cartItemClickListener(event) {
  /*coloque seu código aqui
  event.target.remove();*/
  const items = document.querySelector('.cart__items');
  items.removeChild(event.target);
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
    .then(itens => salvaCarrinho(itens)); /*Salva o carrinho no localStorage*/
}

function createCustomElement(element, className, innerText, id = null) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', function () {
      addCarrinho(id);

    }); /*added this line*/
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

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => getAllProdutos(data.results));

    /*Veririca localStorage*/
    if (localStorage.getItem('carrinho')) {
      const local = localStorage.getItem('carrinho');
      const lista = document.createElement('li');
      lista.className = 'cart__item';
      const texto = document.createTextNode(local);
      const items = document.querySelector('.cart__items');
      lista.appendChild(texto);
      items.appendChild(lista);
    }
};
