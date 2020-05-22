const query = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const queryItem = 'https://api.mercadolibre.com/items/';

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCart = (e) => {
  const id = e.target.parentNode.firstChild.innerText;
  fetch(queryItem + id)
    .then(res => res.json())
    .then((resTreat) => {
      const { id: sku, title: name, price: salePrice } = resTreat;
      const o = { sku, name, salePrice };
      document.querySelector('ol.cart__items').appendChild(createCartItemElement(o));
    })
    .catch(() => console.log('res item error'));
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
  if (className === 'item__add') e.addEventListener('click', addCart); // +
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
const addProd = (pds) => {
  pds.results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const o = { sku, name, image };
    document.querySelector('section.items').appendChild(createProductItemElement(o));
  });
};

const fFetch = (q, call) => {
  fetch(q)
    .then(res => res.json())
    .then(resTreat => call(resTreat))
    .catch(() => console.log('res error'));
};

// Chama a API e adiciona os items nos componentes depois q todo html for carregado
window.onload = function onload() {
  fFetch(query, addProd);
  // const el1 = document.querySelector('.items').childNodes.length;
  // console.log(el1)
};
