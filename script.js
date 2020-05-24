window.onload = function onload() {};

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const cartItemClickListener = event => event.target.remove();


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const funcObjCar = (a) => {
  const obj = { sku: a.id, name: a.title, salePrice: a.price }; // criando variavel recebe  o obj
  const carItm = document.querySelector('.cart__items'); // criando variavel selecionando classe cart_items
  carItm.appendChild(createCartItemElement(obj));
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
  const itemClass = document.querySelector('.items'); // itemClass recebe toda a calsse Item
  paramet.forEach(({ id, title, thumbnail }) => {
    itemClass.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });/* passando valor para keys do obj */
  addCarItens();
};

console.log(convertObject);

const searchProduct = (product) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(url)
    .then(response => response.json())
    .then(kaecio => convertObject(kaecio.results))
    .catch(() => {});
};

// chamada da função abaixo pq a função não foi criada
searchProduct('computador');
