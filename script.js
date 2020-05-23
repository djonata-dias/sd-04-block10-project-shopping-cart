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
  event.target.remove();
  localStorage.removeItem('item');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const toCartList = (data) => {
  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const listSelect = document.querySelector('.cart__items');
  listSelect.appendChild(createCartItemElement(obj));
  localStorage.setItem('item', listSelect.innerHTML);
};

const productList = (results) => {
  const product = {};
  results.forEach((item) => {
    product.sku = item.id;
    product.name = item.title;
    product.image = item.thumbnail;
    const section = createProductItemElement(product);
    document.querySelectorAll('.items')[0].appendChild(section);
  });

  const item = document.querySelectorAll('.item');
  item.forEach((element) => {
    const id = element.firstElementChild.innerHTML;
    element.lastElementChild.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${id}`)
        .then(response => response.json())
        .then(data => toCartList(data))
        .catch(console.error);
    });
  });
};

window.onload = function onload() {
  const rmvAll = document.querySelector('.empty-cart');
  const savedItens = document.querySelector('.cart__items');
  if (localStorage !== null) {
    savedItens.innerHTML = localStorage.getItem('item');
  }

  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  rmvAll.addEventListener('click', () => {
    savedItens.innerHTML = '';
    localStorage.clear();
  });

  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 2000);

  setTimeout(() => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObject)
      .then(response => response.json())
      .then(data => productList(data.results))
      .catch(console.error);
  }, 2000);
  
};
