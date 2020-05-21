window.onload = function onload() {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q="computador"`)
    .then(response => response.json())
    .then(data => buscarElemento(data.results))
    .catch(console.error)
};

function buscarElemento(result) {
  let product = {sku:'', name: '', salePrice: '', image: ''};
  const produtos = result;
  produtos.map((elem) => {
    product.sku = elem.id;
    product.name = elem.title;
    product.salePrice = elem.price;
    product.image = elem.thumbnail;
    console.log(product)
    document.getElementById('items').appendChild(createProductItemElement(product))
    })
  return product
}


//const principalSection = document.getElementById('items');
//principalSection.appendChild(createProductItemElement(product));

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
  //const principalSection = document.getElementById('items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  console.log(section)
  //principalSection.appendChild(section);

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

// criando a chamada do função que busca o elemento.

