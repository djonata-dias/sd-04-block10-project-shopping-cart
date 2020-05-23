

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

function armazenando() {
  const liCartItem = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('produto_carrinho', JSON.stringify(liCartItem));
  console.log(liCartItem);
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  armazenando();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item'; // apensa no ol
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2 - Adicione o produto ao carrinho de compras
function adiconarProdutoById(itemId) {
  const iditem = itemId.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${iditem}`) // assincrona
  .then(responseJ => responseJ.json())
  .then((dadosJ) => {
    document.querySelector('.cart__items').appendChild(createCartItemElement({
      sku: dadosJ.id, name: dadosJ.title, salePrice: dadosJ.price }));
  })
  .then(() => armazenando());
  // se o armazenamento tiver fora do .then ele
  // chama o armazenamento antes do 1º .then
  // então tem que garantir a ordem de execução
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
  .then((dadosEmJson) => {
    dadosEmJson.results.forEach((elementos) => {
      const itemProduto = {
        sku: elementos.id,
        name: elementos.title,
        image: elementos.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(itemProduto));
    });
    // depois da criaçao de todos os botoes adiciona o evento
    document.querySelectorAll('.item__add').forEach((elementos) => {
      elementos.addEventListener('click', (even) => {
        // chamando a funçao que trata dos dados q o evento me retorna
        adiconarProdutoById(even);
      });
    });
  })
  .then(setTimeout(() => (document.querySelector('.loading').remove()), 5git 00))
  .catch(err => console.error('Failed retrieving information', err));
}

function esvaziarCarrinho() {
  document.querySelector('.cart__items').innerHTML = ' ';
  armazenando();
}


window.onload = function onload() {
  doRequisition();
  document.querySelector('.empty-cart').addEventListener('click', esvaziarCarrinho);
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('produto_carrinho');
};
