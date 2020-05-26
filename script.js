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


const setLocalStorage = () => {
  const produtos = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('Produtos', produtos); // chave 'Produtos', valores = itens do carrinho
};

function cartItemClickListener(event) {
  event.target.remove();
  setLocalStorage();
}

const getLocalStorage = () => {
  // refaz o carrinho ao carregar a página
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('Produtos');
  // permitir a remoção de itens individualmente
  const removeItem = document.querySelectorAll('.cart__item');
  removeItem.forEach((elemento) => {
    elemento.addEventListener('click', cartItemClickListener);
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // clique no elemento li chama a função cartItemClickListener
  return li;
}

// -------------------------------------------------------------------- //

// requisito 1 -> retorno da requisicao feita no onload é usado para listar os produtos

// requisito 2 -> botao adicionar ao carrinho dispara uma requisicao a api
// adicionar um evento de clique a cada botao com a classe .item__add

// requisito 3 -> ao ser clicado, um item da lista é removido

// requisito 4 -> localStorage


const addItemLista = (data) => {
  const sku = data.id;
  const name = data.title;
  const salePrice = data.price;
  const lista = document.querySelector('.cart__items');
  lista.appendChild(createCartItemElement({ sku, name, salePrice }));
  setLocalStorage();
};

const addProduto = (event) => {
  const itemId = event.target.parentNode.firstChild.innerText;
  const API_URL_2 = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(API_URL_2)
  .then(response => response.json())
  .then(data => addItemLista(data))
  .catch(error => console.log(error));
};

const emptyCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
  setLocalStorage();
};

const produtos = (produto) => {
  produto.forEach(({ id, title, thumbnail }) => {
    const itemsElement = document.querySelector('.items');
    itemsElement.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  const botaoAdicionar = document.querySelectorAll('.item__add');
  botaoAdicionar.forEach((elemento) => {
    elemento.addEventListener('click', addProduto);
  });
  const botaoEsvaziar = document.querySelector('.empty-cart');
  botaoEsvaziar.addEventListener('click', emptyCart);
};

const createLoading = () => {
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerText = 'Loading';
  document.querySelector('.container').appendChild(div);
};

// onload -> toda vez que a pagina é carregada é feita uma requisicao na API do mercado livre

window.onload = function onload() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(API_URL)
  .then(response => response.json()) // sucesso na requisicao, retorna um objeto json (uma promise)
  .then(produto => produtos(produto.results)) // chave "results" é passada para a funcao "produtos"
  .catch(error => console.log(error));
  // texto loading
  createLoading();
  setTimeout(() => { document.querySelector('.loading').innerText = ''; }, 5000);
  // carregar carrinho
  getLocalStorage();
};
