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
// coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const search = value => window.fetch(`${API_URL}${value}`);

const extraiPesquisa = data => data.json();

const sectionNaSection = (section) => {
  const containerItem = document.querySelector('.items');
  containerItem.appendChild(section);
};

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
  try {
    const searchComputer = await search('computador');
    const json = await extraiPesquisa(searchComputer);
    const resultado = await json.results;
    const resultObj = await buscarNoObj(resultado[0], createProductItemElement);
    await sectionNaSection(resultObj);
  } catch (error) {
    console.log('Ixi, deu erro: ', error);
  }
};

window.onload = () => {
  requisito1();
};
