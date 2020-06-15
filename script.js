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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  // document.getElementsByClassName('cart__items')[0].appendChild(li);
  return li;
}

function tratarClick(event) {
  const listaSegunda = {};
  const itemId = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then(response => response.json())
  .then((data) => {
    listaSegunda.sku = data.id;
    listaSegunda.name = data.title;
    listaSegunda.salePrice = data.price;
    const produtoCart = createCartItemElement(listaSegunda);
    document.querySelector('.cart__items').appendChild(produtoCart);
  });
}

const receberDados = ((dados) => {
  const listaProdutos = {};
  dados.forEach((dado) => {
    listaProdutos.sku = dado.id;
    listaProdutos.name = dado.title;
    listaProdutos.image = dado.thumbnail;
    const produto = createProductItemElement(listaProdutos);
    document.querySelector('.items').appendChild(produto);
  });
  document.querySelectorAll('.item__add').forEach(e => e.addEventListener('click', event => tratarClick(event)));
});

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => receberDados(data.results))
    .catch(console.error);
};
