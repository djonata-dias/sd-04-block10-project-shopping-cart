

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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
  .catch(err => console.error('Failed retrieving information', err));
}

// 2 - Adicione o produto ao carrinho de compras

function addById() {
  document.querySelectorAll('.item').forEach((elementos) => {
    elementos.addEventListener('click', () => {
      const itemID = document.querySelector('span.item__sku').innerHTML;
      fetch(`https://api.mercadolibre.com/items/${itemID}`)
      .then(responseJ => responseJ.json().then((dadosItem) => {
        documento.querySelector('.cart__items').appendChild(createCartItemElement({
          sku: dadosItem.id, name: dadosItem.title, salePrice: dadosItem.price,
        }));
      }));
    });
  });
}

window.onload = function onload() {
  doRequisition();
  addById();
};
