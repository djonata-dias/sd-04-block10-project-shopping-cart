function createProductImageElement(imageSource) { // FUNÇÃO PADRÃO DO PROJETO
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

  // FUNÇÃO PADRÃO DO PROJETO -> criar objeto customizado,
function createCustomElement(element, className, innerText) {
  // recebendo como parâmetro a tag, classe e texto.
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  return e;
}

  // FUNÇÃO PADRÃO DO PROJETO
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {   // FUNÇÃO PADRÃO DO PROJETO
//   return item.querySelector('span.item__sku').innerText;
// }
//  -------------------------------------------------------------------------------------

function cartItemClickListener(event) { // FUNÇÃO PADRÃO DO PROJETO
  event.target.remove(); // ADICIONANDO FUNÇÃO DE REMOVER O ELEMENTO AO CLICAR SOBRE ELE
}
//  -------------------------------------------------------------------------------------

function createCartItemElement({ sku, name, salePrice }) {  // FUNÇÃO PADRÃO DO PROJETO
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelectorAll('.cart__items')[0].appendChild(li);
  // SALVANDO OS ITENS DO CARRINHO DENTRO DO LOCAL STORAGE CRIADO AQUI
  localStorage.fullCart = document.querySelector('ol.cart__items').innerHTML;
  return li;
}
//  -------------------------------------------------------------------------------------

const productInfo = (event) => {  // FUNÇÃO PARA PEGAR AS INFORMAÇÕES DE ITME POR ITEM
  const itemID = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(response => response.json())
    .then(data => createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price }))
    .catch(console.error);
};
//  -------------------------------------------------------------------------------------

const returnProduct = (results) => {  //  FUNÇÃO PARA LISTAR OS PRODUTOS NA TELA
  const product = {};
  results.forEach((item) => {
    product.sku = item.id;
    product.name = item.title;
    product.image = item.thumbnail;
    const section = createProductItemElement(product);
    document.getElementsByClassName('items')[0].appendChild(section);
  });
  document.querySelectorAll('.item__add') // ADICIONANDO O EVENTO DE CLIQUE PARA ADICIONAR AO CARRINHO
      .forEach((item) => {
        item.addEventListener('click', event => productInfo(event));
      });
};
//  -------------------------------------------------------------------------------------

const fetchAPI = (URL) => { // FUNÇÃO FETCH PRA SER CHAMADA NO ONLOAD
  fetch(URL)
  .then(response => response.json())
  .then(data => returnProduct(data.results))
  .catch(console.error);
};
//  -------------------------------------------------------------------------------------

const loading = () => // CRIANDO O ELEMENTO (SPAN) DO LOADING DENTRO DO HEADER COM CLASSE 'TOP-BAR'
  document
    .getElementsByClassName('top-bar')[0].appendChild(createCustomElement('span', 'loading', 'loading...'));


    //----------------------------------------------------------------------------------

const eraseAll = () => {  // SALVANDO OS ARQUIVOS NO LOCAL STORAGE
  if (Storage) {
    document.querySelector('ol.cart__items').innerHTML = localStorage.fullCart;
  }
  document.querySelector('button.empty-cart').addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = ''; // ADICIONANDO A FUNÇÃO DE EXPCLUIR TODOS OS
    localStorage.fullCart = '';                              // ITENS DO CARRINHO DE COMPRAS
  });
};
//  -------------------------------------------------------------------------------------

window.onload = function onload() {
  // CHAMANDO A FUNÇÃO DO FETCH 1
  fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  // CHAMANDO O OBJETO 'LOADING'
  loading();
  //  COLOCANDO O SETTIMEOUT PRO LOADING SUMIR
  setTimeout(() => document.querySelector('.loading').remove(), 2000);
  // CHAMANDO A FUNÇÃO DE APAGAR OS ITENS DO CARRINHO
  eraseAll();
};
