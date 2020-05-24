
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

function cartItemClickListener() {
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const buscaEAplica = (busca, entrada) => {
  const opc = { sku: entrada.id, name: entrada.title, price: entrada.price };

  document.querySelectorAll(busca)[0]
  .appendChild(createCartItemElement(opc));
};

const addButtomCard = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(otherData => otherData.json())
  .then(otherDataJson => buscaEAplica('.cart__items', otherDataJson))
  .catch(error => console.log(error));
};

function createProductItemElement({ sku, name, image }) {
  const butt = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  butt.addEventListener('click', () => addButtomCard(sku));
  section.appendChild(butt);

  return section;
}

const resumeData = (dataJson) => {
  const arrayDeProdutos = dataJson.results;

  arrayDeProdutos.forEach((element) => {
    document.querySelectorAll('.items')[0]
    .appendChild(createProductItemElement({
      sku: element.id, name: element.title, image: element.thumbnail }));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(data => data.json())
  .then(dataJson => resumeData(dataJson))
  .catch(error => console.log(error));
};
