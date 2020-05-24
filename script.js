const query = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const queryItem = 'https://api.mercadolibre.com/items/';
let tPrice = 0;

function getSkuFromProductItem(item) { // ???
  return item.querySelector('span.item__sku').innerText; // retorna o id
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const addSubPricesCart = (price, op) => { // c
  const elTPrice = document.querySelector('.total-price');
  if (op === 'add') {
    tPrice += price;
    localStorage.setItem('tPrice', Number(tPrice.toFixed(2)));
  }
  if (op === 'sub') {
    tPrice -= price;
    localStorage.setItem('tPrice', Number(tPrice.toFixed(2)));
  }
  elTPrice.innerText = Number(tPrice.toFixed(2));
};

function cartItemClickListener(event) { // usada
  // coloque seu código aqui
  event.target.parentNode.removeChild(event.target);
  const str = event.target.innerText;
  const id = str.substring(str.indexOf('M', 0), str.indexOf(' |', 0));
  const price = Number(str.substring(str.indexOf('$', 0) + 1, str.length));
  const its = JSON.parse(localStorage.getItem('items'));
  for (let i = 0; i < its.length; i += 2) {
    if (its[i] === id) {
      localStorage.removeItem('items');
      its.splice(i, 2);
      localStorage.setItem('items', JSON.stringify(its));
      break;
    }
  }
  addSubPricesCart(price, 'sub');
}

function createCartItemElement({ sku, name, salePrice }) { // usada
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  // - Lógica de inserção do id e title no localStorage
  // quando o botão 'Adicionar ao carrinho!' é clicado
  const its = JSON.parse(localStorage.getItem('items')); // +
  its.push(sku); // +
  its.push(li.innerText); // +
  localStorage.setItem('items', JSON.stringify(its)); // +

  return li;
}

const fFetch = (q, call) => { // c
  const pLoading = document.querySelector('.loading');
  pLoading.innerText = 'loading...';
  fetch(q)
    .then((res) => {
      pLoading.style.display = 'none';
      return res.json()
    })
    .then(resTreat => call(resTreat))
    .catch(() => console.log('res error'));
};

// - Refatoração com fFetch() pq CC apontava duplicação de código
const addCart = (itsTreat) => { // c
  const o = {
    sku: itsTreat.id,
    name: itsTreat.title,
    salePrice: itsTreat.price,
  };
  document.querySelector('ol.cart__items').appendChild(createCartItemElement(o));
  addSubPricesCart(Number(itsTreat.price), 'add');
};

// - Refatoração com fFetch() pq CC apontava duplicação de código
const evAddCart = (e) => { // c
  const id = e.target.parentNode.firstChild.innerText;
  fFetch(queryItem + id, addCart);
};

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

// --- window onload

async function verifyLocalStorage() { // c
  const elOl = document.querySelector('ol.cart__items');
  const its = await JSON.parse(localStorage.getItem('items'));
  tPrice = await JSON.parse(localStorage.getItem('tPrice'));
  document.querySelector('.total-price').innerText = Number(tPrice.toFixed(2));
  for (let i = 1; i < its.length; i += 2) {
    const li = document.createElement('li');
    const content = its[i];
    li.addEventListener('click', cartItemClickListener);
    li.innerText = content;
    elOl.appendChild(li);
  }
}

// - Refatoração com fFetch() pq CC apontava duplicação de código
// - Função addProd recebe a resposta da API tratada
const addProd = (pds) => { // c
  pds.results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const o = { sku, name, image };
    document.querySelector('section.items').appendChild(createProductItemElement(o));
  });
};

const addEvButEmpCart = () => { // c
  const butEmpCart = document.querySelector('.empty-cart');
  const olCart = document.querySelector('.cart__items');
  const elTPrice = document.querySelector('.total-price');
  butEmpCart.addEventListener('click', () => {
    olCart.innerText = '';
    tPrice = 0;
    localStorage.setItem('tPrice', JSON.stringify(0));
    localStorage.setItem('items', JSON.stringify([]));
    elTPrice.innerText = tPrice;
  });
};

// - Ao carregar verifica se há valores armazenados no localStorage, se não há insere-os
// - Chama a API e adiciona os items nos componentes depois q todo html for carregado
// - Adiciona evento e lógica necessária para esvaziar carrinho
window.onload = function onload() {
  if (!localStorage.getItem('tPrice')) localStorage.setItem('tPrice', JSON.stringify(0));
  if (!localStorage.getItem('items')) localStorage.setItem('items', JSON.stringify([]));
  verifyLocalStorage();
  fFetch(query, addProd);
  addEvButEmpCart();
};
