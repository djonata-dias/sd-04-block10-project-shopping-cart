const secItems = document.querySelector('.items'); // Manipula section items.
const carrinho = document.querySelector('.cart__items');
const cart = []; // Vou ver o que faço com isso.

const saveToStorage = () => {
  localStorage.setItem('itens_carrinho', JSON.stringify(cart));
};

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
  const code = event.target.innerText.substring(5, 18);
  cart.splice(cart.indexOf(code), 1);
  saveToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (code) => {
  // const code = e.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${code}`)
  .then(responsta => responsta.json())
  .then(({ id, title, price }) => {
    const item = createCartItemElement({ sku: id, name: title, salePrice: price });
    cart.push(id);
    carrinho.append(item);
    saveToStorage();
  })
  .catch(error => console.log(error));
};

const completaAdd = (e) => {
  const code = e.target.parentNode.firstChild.innerText;
  addToCart(code);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', completaAdd);
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
  const salvos = JSON.parse(localStorage.itens_carrinho);
  if (localStorage.itens_carrinho) {
    salvos.forEach(code => addToCart(code));
  }
};
