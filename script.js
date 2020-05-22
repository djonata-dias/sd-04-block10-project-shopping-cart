const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const myObj = { method: 'GET' };
const sectionItems = document.getElementsByClassName('items');

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
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

//  Function here...

//  Requirement 1

const createList = dados => {
  const arrayList = [];
  dados.results.forEach(element => {
    arrayList.push(element);
  });
  //  console.log(arrayList)
  const arrayProducts = [];
  arrayList.forEach(e => {
    arrayProducts.push({
      sku: e.id,
      name: e.title,
      image: e.thumbnail,
    });
    //  console.log(arrayProducts);
  });
  return arrayProducts;
};

const printList = array =>
  array.forEach(e => {
    sectionItems[0].appendChild(createProductItemElement(e));
  });

//  Requirement 2

const addCartElements = data => {
  const objAddCartElem = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const li = createCartItemElement(objAddCartElem);
  const ol = document.getElementsByClassName('.cart_items');
  ol.appendChild(li);
};

const fetchItemSelected = id => {
  const ID_URL = `https://api.mercadolibre.com/items/${id}`;
  fetch(ID_URL)
    .then(data => data.json())
    .then(dados => addCartElements(dados))
    .catch(error => console.log(error));
};

const idElementsClick = event => {
  const parentNodeSection = event.target.parentNode;
  const firstId = parentNodeSection.firstChild.innerText;
  fetchItemSelected(firstId);
};

const requestButtons = () => {
  const btns = document.getElementsByClassName('item__add');
  btns.forEach(element => {
    element.addEventListener('click', idElementsClick);
  });
};

window.onload = function onload() {
  fetch(API_URL, myObj)
    .then(data => data.json())
    .then(dados => createList(dados))
    .then(array => printList(array))
    .then(requestButtons)
    .catch(error => console.log(error));
};
