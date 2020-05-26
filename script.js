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

function armazenando() {
  const liCartItem = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('produto_carrinho', JSON.stringify(liCartItem));
  console.log(liCartItem);
}

function cartItemClickListener(event) {
  event.target.remove();
  armazenando();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function adicionarProdutoById(itemId) {
  const idItem = itemId.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
  .then(responseJ => responseJ.json())
  .then((dadosJ) => {
    document.querySelector('.cart__items').appendChild(createCartItemElement({
      sku: dadosJ.id, name: dadosJ.title, salePrice: dadosJ.price }));
  })
  .then(() => armazenando());
}

function doRequisition() {
  const query = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then(response => response.json())
  .then((dadosEmJson) => {
    dadosEmJson.results.forEach((elementos) => {
      const itemProduto = {
        sku: elementos.id,
        name: elementos.title,
        image: elementos.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(itemProduto));
    });
    document.querySelectorAll('.item__add').forEach((elementos) => {
      elementos.addEventListener('click', (even) => {
        adicionarProdutoById(even);
      });
    });
  })
  .then(setTimeout(() => (document.querySelector('.loading').remove()), 500))
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
