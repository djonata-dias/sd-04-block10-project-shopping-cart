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
  const section = document.createElement('section'); // cria uma section
  section.className = 'item'; // atribui à section criada a classe .item

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li; // elementoOL.appendChild(createCartItemElement({ sku, name, salePrice }))
// }

// -------------------------------------------------------------------- //

// requisito 1 -> retorno da requisicao feita no onload é usado para listar os produtos

const produtos = (produto) => {
  // console.log(produto) -> array de objetos (cada objeto com infos de um produto)

  produto.forEach((elemento) => {
    const sku = elemento.id;
    const name = elemento.title;
    const image = elemento.thumbnail;
    const itemsElement = document.querySelector('.items');
    itemsElement.appendChild(createProductItemElement({ sku, name, image }));
  });
};


// requisito 2 -> botao adicionar ao carrinho dispara uma requisicao a api

// const botaoAdicionar = document.querySelectorAll('.item__add');
// console.log(botaoAdicionar); // Node List


// onload -> toda vez que a pagina é carregada é feita uma requisicao na API do mercado livre

window.onload = function onload() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(API_URL)
  .then(response => response.json()) // sucesso na requisicao, retorna um objeto json (uma promise)
  .then(produto => produtos(produto.results))
  .catch(error => console.log(error));
};
