const secItems = document.querySelector('.items'); // Manipula section items.
const carrinho = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (e) => {
  const code = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${code}`)
  .then(responsta => responsta.json())
  .then(({ id, title, price }) => {
    carrinho.append(createCartItemElement({ sku: id, name: title, salePrice: price }));
  })
  .catch(error => console.log(error));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addToCart);
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(responsta => responsta.json())
  .then((json) => {
    json.results.forEach((prod) => {
      const { id: sku, title: name, thumbnail: image } = prod;
      secItems.append(createProductItemElement({ sku, name, image }));
    });
  })
  .catch(error => console.log(error));
};
