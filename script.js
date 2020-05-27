window.onload = function onload() { };

const btnClearCar = document.querySelector('.empty-cart');

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
// keys dos objetos//
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

async function sumItem() {
  const cartItems = document.querySelector('.cart__items'); // criando variavel q recebe todos <li>
  const totalPrice = document.querySelector('.total-price'); // --//--- --//-- -recebe o price total
  const arrayPrice = []; // recebe array de preços
  let total = 0; // recebe o valor total em numeros
  const listItems = cartItems.children;
  for (let i = 0; i < listItems.length; i += 1) {
    // pegando o tamanho da lista
    const item = listItems[i].innerText.split(' ');
    const gotPrice = Number(item[item.length - 1].substr(1));
    arrayPrice.push(gotPrice);
  }
  total = arrayPrice.reduce((acc, atual) => acc + atual, 0);
  totalPrice.innerHTML = total;
  if (totalPrice.innerHTML === '0') {
    totalPrice.innerHTML = '';
  }
}

const cartItemClickListener = (event) => {
  event.target.remove();
  sumItem();
};
// removendo o event de dentro da função e usando fora, funciona normalmente

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const funcObjCar = (a) => {
  const obj = { sku: a.id, name: a.title, salePrice: a.price }; // criando variavel recebe o obj
  const carItem = document.querySelector('.cart__items'); // criando variavel selecionando classe cart_items
  carItem.appendChild(createCartItemElement(obj)); // setando o obj pra dentro do carItem
  sumItem();
};

const addCarItens = () => {
  const buttAdd = document.querySelectorAll('.item');
  buttAdd.forEach((element) => {
    element.lastElementChild.addEventListener('click', () => {
      const idSku = element.firstElementChild.innerHTML; // cria variavel e joga primeiro
      const url = `https://api.mercadolibre.com/items/${idSku}`;
      fetch(url)
        .then(response => response.json())
        .then(a => funcObjCar(a));
    });
  });
};

const convertObject = (paramet) => {
  // criando a função
  const itemClass = document.querySelector('.items'); // itemClass recebe toda a classe Item
  paramet.forEach(({ id, title, thumbnail }) => {
    itemClass.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  }); /* passando valor para keys do obj */
  addCarItens();
};

console.log(convertObject);

const searchProduct = (product) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(url)
    .then(response => response.json())
    .then(kaecio => convertObject(kaecio.results));
};

// chamada da função abaixo pq a função não foi criada
searchProduct('computador');

const clearItems = () => {
  const allItems = document.querySelector('.cart__items');
  allItems.innerHTML = '';
  sumItem();
};

btnClearCar.addEventListener('click', clearItems);
