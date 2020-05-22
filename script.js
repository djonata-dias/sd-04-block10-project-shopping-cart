const query = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const queryItem = 'https://api.mercadolibre.com/items/';

const fFetch = (q, call) => { // c
  fetch(q)
    .then(res => res.json())
    .then(resTreat => call(resTreat))
    .catch(() => console.log('res error'));
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.parentNode.removeChild(event.target);
  const id = event.target.innerText.substring(5, 18);
  localStorage.removeItem(id);
}

function createCartItemElement({ sku, name, salePrice }) { // usada
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(sku, li.innerText);
  return li;
}

// refatoração com fFetch() pq CC apontava duplicação de código
const addCart = (its) => { // c
  const o = {
    sku: its.id,
    name: its.title,
    salePrice: its.price,
  };
  document.querySelector('ol.cart__items').appendChild(createCartItemElement(o));
};

// refatoração com fFetch() pq CC apontava duplicação de código
const evAddCart = (e) => { // c
  const id = e.target.parentNode.firstChild.innerText;
  fFetch(queryItem + id, addCart);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // usada
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (className === 'item__add') e.addEventListener('click', evAddCart); // +
  return e;
}

function createProductItemElement({ sku, name, image }) { // usada
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) { // !!!
  return item.querySelector('span.item__sku').innerText; // retorna o id
}

// refatoração com fFetch() pq CC apontava duplicação de código
const addProd = (pds) => { // c
  pds.results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const o = { sku, name, image };
    document.querySelector('section.items').appendChild(createProductItemElement(o));
  });
};

const verifyLocalStorage = () => { // c
  const elOl = document.querySelector('ol.cart__items');
  for (let i = 0; i < localStorage.length; i += 1) {
    const li = document.createElement('li');
    const item = localStorage.getItem(localStorage.key(i));
    li.addEventListener('click', cartItemClickListener);
    li.innerText = item;
    elOl.appendChild(li);
  }
};

// Chama a API e adiciona os items nos componentes depois q todo html for carregado
window.onload = function onload() {
  fFetch(query, addProd);
  verifyLocalStorage();
};
