// essa função assync só vai funcionar quando ela for chamada...
// por isso ela deve ficar mais acima do código.
async function totalPrice() {
  const items = document.querySelectorAll('.cart__item');
  const totalHtml = document.querySelector('.total-price');
  let total = 0;
  if (items.length === 0) {
    console.log(total.toFixed(2));
  } else {
    items.forEach((item) => {
      const string = item.innerText.split('$')[1];
      total += parseFloat(string);
      console.log(total.toFixed(2));
    });
  }
  if (Number.isInteger(total)) {
    totalHtml.innerText = Math.trunc(total);
  } else {
    totalHtml.innerText = total.toFixed(2);
  }
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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.wishList = document.querySelector('ol.cart__items').innerHTML;
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementsByClassName('cart__items')[0].appendChild(li);
  localStorage.wishList = document.querySelector('ol.cart__items').innerHTML;
  totalPrice();
  return li;
  // tudo que está abaixo do retorno não roda... 2020-Ronan
}

// vamos criar uma função para tratar os dados do evento de click e jogar para o carrinho de compras

function getAllInfoFromProductItem(event) {
  const itemID = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(response => response.json())
    .then(data =>
      createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }),
    )
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
  document
    .querySelectorAll('.item__add')
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

const apagarCarrinhoButton = () => {
  if (localStorage.wishList) {
    document.querySelector('ol.cart__items').innerHTML = localStorage.wishList;
    totalPrice();
  }
  document.querySelector('button.empty-cart').addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    localStorage.wishList = '';
    totalPrice();
  });
  // essa linha faz apagar os itens do carrinho depois de dar o reload na página
  document
    .querySelector('.cart__items')
    .addEventListener('click', cartItemClickListener);
};

const loading = () =>
  document
    .getElementsByClassName('top-bar')[0]
    .appendChild(createCustomElement('span', 'loading', 'loading...'));

window.onload = function onload() {
  totalPrice();
  fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  loading();
  setTimeout(() => document.querySelector('.loading').remove(), 3000);
  apagarCarrinhoButton();
};
