const myObject = { method: 'GET', headers: new Headers() };
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

const sumPrices = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].textContent = Math.round([...cartItem].map(e => e.textContent
    .match(/([0-9.]){1,}$/))
    .reduce((acc, price) => acc + parseFloat(price), 0) * 100) / 100;
};

const updateCart = () => {
  localStorage.setItem('itemCart', document.getElementsByClassName('cart__items')[0].innerHTML);
  sumPrices();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  updateCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addElementToCart = async ({ sku }) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(data => data.json())
  .then((product) => {
    document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }));
    updateCart();
  });
  await (localStorage.setItem('itemCart', document.getElementsByClassName('cart__items')[0].innerHTML));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const selectBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  selectBtn.addEventListener('click', () => {
    selectCartItemElement({ sku });
  });
  section.appendChild(selectBtn);
  return section;
}

window.onload = async () => {
  setLoading(true);
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(r => r.json())
  .then((data) => {
    data.results.map(function (res) {
      return document.querySelector('.items').appendChild(createProductItemElement(
        {
          sku: res.id,
          name: res.title,
          image: res.thumbnail,
        },
        ));
    });
    setLoading(false);
  });
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', async () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    await updateCart();
  });
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('Cart_items');
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  await updateCart();
};
