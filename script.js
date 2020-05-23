function saveCart() {
  //  salva cart no local storage
  const lista = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart_list', lista);
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  clear();
  event.target.remove();
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function adicionarCarrinho(datajson) {
  const produto = document.querySelector('.cart__items');
  produto.appendChild(
    createCartItemElement({
      sku: datajson.id,
      name: datajson.title,
      salePrice: datajson.price,
    }),
  );
  saveCart();
}

// ### Gera os displays, com os produtos.
const productInfo = (productArray) => {
  productArray.forEach((e) => {
    const sku = e.id;
    const name = e.title;
    const image = e.thumbnail;
    document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
  });
  // Aqui vai ser criado os itens do carrinho.
  const product = document.querySelectorAll('.item');
  product.forEach((element) => {
    element.lastElementChild.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(element)}`)
        .then((data) => data.json())
        .then((datajson) => adicionarCarrinho(datajson))
        .catch((error) => console.log(error.message));
    });
  });
};

// Chama API
function recuperaApiML() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => productInfo(data.results));
}

//  esvaziar cart
const clear = () => {
  //  seleciona elemento com classe 'empty-cart'
  const btnClearAll = document.querySelector('.empty-cart');
  btnClearAll.addEventListener('click', () => {
    //  remove todos os elementos com classe cart__item (produtos do carrinho)
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach((item) => item.remove());
  });
};

function loadCart() {
  //  carrega cart salvo no local storage
  const savedList = localStorage.getItem('cart_list');
  document.querySelector('.cart__items').innerHTML = savedList;
  const cart = document.querySelector('.cart__items');
  cart.addEventListener('click', cartItemClickListener);
  clear();
}

window.onload = function onload() {
  recuperaApiML().catch((error) => console.error(error));
  loadCart();
};
