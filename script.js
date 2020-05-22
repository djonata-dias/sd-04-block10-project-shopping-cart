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

// -----------------------------------------------------
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const search = value => window.fetch(`${API_URL}${value}`);

const extraiPesquisa = data => data.json();

const buscarNoObj = ({ id, title, price, thumbnail }, fun) => {
  const newObjeto = {
    sku: id,
    name: title,
    salePrice: price,
    image: thumbnail,
  };
  return fun(newObjeto);
};

const requisito1 = async () => {
  const containerItem = document.querySelector('.items');
  try {
    const searchComputer = await search('computador');
    const json = await extraiPesquisa(searchComputer);
    await json.results.forEach((elementos) => {
      containerItem.appendChild(buscarNoObj(elementos, createProductItemElement));
    });
  } catch (error) {
    console.log('Ixi, deu erro no requisito 1: ', error);
  }
};

// ----------------------------------------------------
// function cartItemClickListener(event) {
//   const ol = document.querySelector('.cart__items');
//   const item = document.querySelector('.cart__item');
//   ol.appendChild(item);
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// const API_URL_CART = 'https://api.mercadolibre.com/items/';

// const cartItem = itemID => window.fetch(`${API_URL_CART}${itemID}`);

// const requisito2 = async () => {
//   try {
//     const search = await cartItem('MLB1341706310');
//     const json = await extraiPesquisa(search);
//     const creatElement = await buscarNoObj(json, createCartItemElement);
//     console.log(json);
//   } catch (error) {
//     console.log('Ixi, deu erro no requisito 2: ', error);
//   }
// };

window.onload = () => {
  requisito1();
  // requisito2();
};
