const APIURL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const PESQUISA = 'computador';
const URLITEM = 'https://api.mercadolibre.com/items/';
// const ITEMID = '$ItemID';

function saveCart() { //  salva cart no local storage
  localStorage.setItem('cart_list', document.querySelector('.cart__items').innerHTML);
}

//  esvaziar cart
const clear = () => {
  //  seleciona elemento com classe 'empty-cart'
  const btnClearAll = document.querySelector('.empty-cart');
  btnClearAll.addEventListener('click', () => {
    //  remove todos os elementos com classe cart__item (produtos do carrinho)
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach(item => item.remove());
    document.querySelector('.total-price').innerHTML = 0;
    saveCart();
  });
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function totalCalc() {
  const items = document.querySelectorAll('.cart__item');
  const totalHtml = document.querySelector('.total-price');
  let total = 0;
  if (items.length !== 0) {
    items.forEach((item) => {
      const string = item.innerText.split('$')[1];
      total += Number(string);
    });
  }
  totalHtml.innerText = (Number(total.toFixed(2)));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  totalCalc();
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


const addToCart = (datajson) => {
  const produto = document.querySelector('.cart__items');
  produto.appendChild(createCartItemElement(
    { sku: datajson.id, name: datajson.title, salePrice: datajson.price }));
  totalCalc(datajson.price);
  console.log(datajson.price);
  saveCart();
};

const gerarLista = (productArr) => {
  const items = document.querySelectorAll('.items');
  //  loop para gerar os elementos em <section class="items">
  productArr.forEach((produto) => {
    const { id, title, thumbnail } = produto;
    items[0].appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  const product = document.querySelectorAll('.item');
  //  loop para add event listener nos botões de adicionar ao carrinho
  product.forEach((element) => {
    element.lastElementChild.addEventListener('click', () => { //  lastElemntChild é o botão que recebe o event listener
      fetch(`${URLITEM}${getSkuFromProductItem(element)}`) //  getSkuFromProductItem retorna id do produto
        .then(data => data.json()) //  converte p json
        .then(datajson => addToCart(datajson)) //  manda p tratar e add to cart
        .catch(error => console.log(error.message));
    });
  });
};

function loadCart() { //  carrega cart salvo no local storage e funções
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart_list');
  const cart = document.querySelector('.cart__items');
  cart.addEventListener('click', cartItemClickListener); //  adiciona o event listener
  totalCalc();
  clear(); //  adiciona função de limpar
}

function loading() { //  adiciona elemento com texto 'loading...'
  const sectionLoad = document.createElement('section');
  sectionLoad.className = 'loading';
  sectionLoad.innerHTML = 'loading...';
  document.querySelector('.items').appendChild(sectionLoad);
}

window.onload = function onload() {
  setTimeout(() => {
    loading();
    document.querySelector('.loading').remove();
  }, 1000);
  fetch(`${APIURL}${PESQUISA}`)
    .then(data => data.json())
    .then(datajson => gerarLista(datajson.results))
    .catch(error => console.log(error.message));
  loadCart();
};
