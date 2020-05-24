// Declaro as variaveis aqui pois vou chamar a variavel em mais de um momento;
// Seus valores são adicionados ao iniciar a pagina no window.onload
let cartList;// Declaro o cartList inicialmente para não criar um li undefined;
let priceItems;

//! Faço o salvamento do carrinho de compras:
const save = () => {
  if (typeof (Storage) !== 'undefined') { // Caso o navegador suporte o localStorage;
    window.localStorage.itens = cartList.innerHTML;// Salvo o carrinho de compras;
    window.localStorage.totalprice = priceItems.innerHTML;// Salvo o preço;
  } else {
    console.log('Não há suporte para storage');
  }
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

//! Faço a soma dos preços dos produtos do carrinho:
const priceCart = () => {
  const arrayLi = cartList.childNodes;// Array com os li's do carrinho;
  let total = 0;
  // Somo os valores dos itens atraves do id que equivale ao salePrice do produto;
  arrayLi.forEach((li) => { total += Number(li.id); });
  priceItems.innerHTML = `${total}`;// Imprimo o total dos itens;
};

//! Evento de click para o carrinho:
function cartItemClickListener(event) {
  event.target.remove();// Apago um item do carrinho;
  priceCart();// Atualizo o preço apos apagar o item;
  save();// Salvo novamente depois de apagar um item;
}

//! Carrego os itens salvos ao carregar a pagina:
const loadSave = () => {
  cartList.innerHTML = window.localStorage.itens;
  // Crio um evento de click para cada item(li) do carrinho, para poder remove-los;
  cartList.childNodes.forEach(li => li.addEventListener('click', cartItemClickListener));
  priceItems.innerHTML = window.localStorage.totalprice;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = salePrice;// Adiciono o id com o valor do preço do produto para pegar depois;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const API_URL_CART = 'https://api.mercadolibre.com/items/';

const extraiPesquisa = data => data.json();// Transformo em Json;

//! Crio um objeto para pegar as informações na função:
const buscarNoObj = ({ id, title, price, thumbnail }, função) => {
  const newObjeto = {
    sku: id,
    name: title,
    salePrice: price,
    image: thumbnail,
  };
  return função(newObjeto);
};

//! Pego o id do produto e coloca no carrinho:
async function cartItem(id) {
  try {
    const searchId = await window.fetch(`${API_URL_CART}${id}`);
    const json = await extraiPesquisa(searchId);
    await cartList.appendChild(buscarNoObj(json, createCartItemElement));
    await priceCart();// Chama a função de preço;
    await save();// Salva no localStorage toda vez que adiciono;
  } catch (error) {
    console.log('Ixi, deu erro no carrinho: ', error);
  }
}

//! Retorna o primeiro elemento descendente do elemento;
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

//! Crio uma função para quando clicar no botão e pegar o id:
const produtClick = (event) => {
  // event.target pega o button;
  // event.target.parentNode pega o pai do botão que cliquei;
  // Resultado da função getSkuFromProductItem é o id do produto;
  const id = getSkuFromProductItem(event.target.parentNode);
  // coloca esse id como parametro na função cartItem;
  cartItem(id);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  // Se esse elemento for um botão chamo um evento de click
  if (element === 'button') e.addEventListener('click', produtClick);
  return e;
}

//! Crio uma div com class='loading' com innerText 'loading...'
const loading = () => {
  const spanLoad = createCustomElement('div', 'loading', 'loading...');
  const containerItem = document.querySelector('.items');
  containerItem.appendChild(spanLoad);// Coloco essa div dentro do container;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// -----------------------------------------------------
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const search = value => window.fetch(`${API_URL}${value}`);

//! Adiciono os produtos e crio section no HTML
const addlist = async () => {
  const containerItem = document.querySelector('.items');
  try {
    const searchComputer = await search('computador');// URL API;
    const json = await extraiPesquisa(searchComputer);// Transformo em JSON;
    await json.results.forEach((elementos) => {
      containerItem.appendChild(buscarNoObj(elementos, createProductItemElement));
    });// Pego os results do JSON e crio uma section para cada um dos produtos;
    // Após carregar a lista removo o loading:
    await document.querySelector('.loading').remove();
  } catch (error) {
    console.log('Ixi, deu erro no carregamento dos produtos: ', error);
  }
};

//! Botão de limpar o carrinho:
const clearAll = () => {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    cartList.innerHTML = '';// Limpo o carrinho;
    priceItems.innerHTML = 0;// Após limpar o carrinho o preço vai para 0;
  });
};

// ----------------------------------------------
window.onload = () => {
  setTimeout(() => addlist(), 1000);// Adiciono a lista de produtos após 1s;
  loading();
  cartList = document.querySelector('.cart__items');
  priceItems = document.querySelector('.total-price');
  loadSave();
  clearAll();
};
