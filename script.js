

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

// as variáveis `sku`, no código fornecido, se referem aos campos `id` retornados pela API.
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

function cartItemClickListener(event) {
  event.target.remove();
  window.localStorage.removeItem(event.target.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2 - Adicione o produto ao carrinho de compras
function addById() {
  document.querySelectorAll('.item').forEach((elementos) => {
    elementos.addEventListener('click', () => {
      // const itemId = document.querySelector('span.item__sku').innerText;
      fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(elementos)}`)
      .then(responseJ => responseJ.json()).then((dadosItem) => {
        document.querySelector('.cart__items').appendChild(createCartItemElement({
          sku: dadosItem.id, name: dadosItem.title, salePrice: dadosItem.price }));
      });
      localStorage.setItem('carrinho', document.querySelector('.cart__itens').innerHTML);
    });
  });
}

// 1 - Listagem de produtos;

function doRequisition() {
  // Fazendo a requisição com Fetch ( Fetch API segue o padrão de Promise):
  const query = 'computador'; // parametro para a busca na API;
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)

  // .then((response) => console.log(response))//objeto response;
  // o json() converte o conteudo do body da response e retorna outra promise.
  .then(response => response.json())
  /* retorna o array results da promise(deve-se iteragir com results e retornar os parâmetros da
  funçao  `createProdutItemElement` num objeto e apensá-los no html)*/
  // .then ((dadosEmJson) => console.log(dadosEmJson.results))
  .then(dadosEmJson => dadosEmJson.results.forEach((elementos) => {
    const itemProduto = {
      sku: elementos.id,
      name: elementos.title,
      image: elementos.thumbnail,
    };
    document.querySelector('.items').appendChild(createProductItemElement(itemProduto));
  }))
  .then(() => {
    addById();
  })
  .catch(err => console.error('Failed retrieving information', err));
}

function esvaziarCarrinho() {
  document.querySelector('.cart__items').innerHTML = ' ';
  window.localStorage.clear();
}

window.onload = function onload() {
  doRequisition();
  document.querySelector('.empty-cart').addEventListener('click', esvaziarCarrinho);
  // document.querySelector('.cart__itens').innerHTML = localStorage.getItem('carrinho');
};
