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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
// feitos

const limpaCarrinhoFunction = () => {
  const limpaCarrinho = document.querySelector('.empty-cart');
  limpaCarrinho.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
  });
};

const query = 'computador';

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const pegaInfos = ({ id, title, thumbnail }, callback) => {
  const obj = {
    sku: id,
    name: title,
    image: thumbnail,
  };
  return callback(obj);
};

const criaList = async () => {
  const listItens = document.querySelector('.items');
  try {
    const response = await fetch(`${API_URL}${query}`);
    const responseJson = await response.json();
    const products = responseJson.results;
    await products.forEach((e) => {
      listItens.appendChild(pegaInfos(e, createProductItemElement));
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

window.onload = () => {
  criaList();

  limpaCarrinhoFunction();
};
