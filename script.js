function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function addToCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => data)
    .then(addToCartObj);
}

function createCustomElement(element, className, innerText, id = null) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', () => {
      addToCart(id);
    }); // added this line
  }
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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku),
  );
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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

function listItems(array) {
  const sectionItems = document.querySelector('section.items');
  array.forEach((computerObj) => {
    const { id: sku, title: name, thumbnail: image } = computerObj;
    const newObj = { sku, name, image };
    // Adicione o elemento retornado da função createProductItemElement(product)
    // como filho do elemento <section class="items">.
    sectionItems.appendChild(createProductItemElement(newObj));
  });
}

const fetchList = () => {
  const myObj = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  // Você deve criar uma listagem de produtos que devem ser consultados através da API do Mercado Livre.
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObj)
    .then(response => response.json())
    .then(data => data.results) //A lista de produtos que devem ser exibidos é o array results no JSON acima.
    .then(listItems); // Você deve utilizar a função createProductItemElement(product) para criar os componentes HTML referentes a um produto.

};

function addToCartObj(obj) {
  const { id: sku, title: name, price: salePrice } = obj;
  console.log({ sku, name, salePrice });
  return { sku, name, salePrice };
}

window.onload = function onload() {
  fetchList();
};
