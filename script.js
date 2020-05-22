

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  // Validando button para adicionar no carrinho
  const btn = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  btn.addEventListener('click', async () => {
    await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(resolve => resolve.json()).then(((produts) => {
      const item = document.getElementsByClassName('cart__items')[0];
      item.appendChild(createCartItemElement({
        sku: produts.id,
        name: produts.title,
        salePrice: produts.price,
      }));
    }));
    localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  });
  section.appendChild(btn);
  return section;
}

// Tratando elemento que retornam da API
const tratarRetornoDaApi = dados =>
dados.map(product => document.getElementsByClassName('items')[0]
.appendChild(createProductItemElement({
  sku: product.id,
  name: product.title,
  image: product.thumbnail,
})));

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

window.onload = function onload() {
  const query = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then(data => data.json())
    .then(dadosEmFormatoJson => tratarRetornoDaApi(dadosEmFormatoJson.results))
    .catch(error => console.log(error));
};
