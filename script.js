
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementsByClassName('cart__items')[0].appendChild(li);
  return li;
}

// vamos criar uma função para tratar os dados do evento de click e jogar para o carrinho de compras

function getAllInfoFromProductItem(event) {
  const itemID = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(response => response.json())
    .then(data => createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price }))
    .catch(console.error);
}

// criando a chamada da função que busca o produto.

const returnProduct = (results) => {
  const product = {}; // inicializar a contagem ou função ou array... nesse caso o json...
  results.forEach((item) => {
    product.sku = item.id;
    product.name = item.title;
    product.image = item.thumbnail;
    const section = createProductItemElement(product);
    document.getElementsByClassName('items')[0].appendChild(section);
  });
  //  pegando o evento de click e colocando numa variável
  document.querySelectorAll('.item__add')
  //  o querySelectorAll devolve um array com todos os elementos...
  //  nesse caso um array com os elementos dessa class.
      .forEach((item) => {
        item.addEventListener('click', event => getAllInfoFromProductItem(event)); // aqui eu adicionei o evento ao item
      });
};

const fetchAPI = (URL) => {
  fetch(URL)
  .then(response => response.json())
  .then(data => returnProduct(data.results))
  .catch(console.error); 
};

window.onload = function onload() {
  fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador')
};
