const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const myObj = { method: 'GET' };

const creatList = (dados) => {
  const arrayList = [];
  dados.results.forEach((element) => {
    arrayList.push(element);
  });
  //  console.log(arrayList)
  const arrayProducts = [];
  arrayList.forEach((e) => {
    arrayProducts.push({
      ski: e.id,
      name: e.title,
      image: e.thumbnail,
    });
    console.log(arrayProducts);
  });
  return arrayProducts;
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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
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

window.onload = function onload() {
  fetch(API_URL, myObj)
    .then((data) => data.json())
    .then((dados) => creatList(dados))
    .catch((error) => console.log(error));
};
