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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  console.log(li);
  return li;
}

function cartItemClickListener(event) {
  const eventPai = event.target.parentNode;
  const numeroSku = eventPai.children[0].innerText;
  fetch(`https://api.mercadolibre.com/items/${numeroSku}`)
  .then(resolve => resolve.json())
  .then((data) => {
    const parameter = { sku: data.id, name: data.title, salePrice: data.price };
    createCartItemElement(parameter);
  });
  console.log(eventPai);
}

// criando a chamada do função que busca o elemento.
function buscarElemento(result) {
  const product = { sku: '', name: '', salePrice: '', image: '' };
  const produtos = result;
  produtos.map((elem) => {
    product.sku = elem.id;
    product.name = elem.title;
    product.salePrice = elem.price;
    product.image = elem.thumbnail;
    document.getElementById('items').appendChild(createProductItemElement(product));
    return product;
  });
  const clickCart = document.querySelectorAll('.item__add');
  clickCart.forEach(index => index.addEventListener('click', event => cartItemClickListener(event)));
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => buscarElemento(data.results))
    .catch(console.error);
};
