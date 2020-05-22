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
  // coloque seu código aqui
  event.target.remove(); //  really?! kkkkk sogra desce
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addToCart = (datajson) => { //  trata e add to cart fino
  const produto = document.querySelector('.cart__items');
  produto.appendChild(createCartItemElement({ sku: datajson.id, name: datajson.title, salePrice: datajson.price }));
};

const APIURL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const PESQUISA = 'computador';
const URLITEM = 'https://api.mercadolibre.com/items/';
// const ITEMID = '$ItemID';

const gerarLista = (productArr) => {
  const items = document.querySelectorAll('.items');
  //  loop para gerar os elementos em <section class="items">
  productArr.forEach((produto) => {
    const { id, title, thumbnail } = produto;
    items[0].appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
    const product = document.querySelectorAll('.item');
    //  loop para add event listener nos botões de adicionar ao carrinho
    product.forEach((element) => {
      element.lastElementChild.addEventListener('click', () => { //  lastElemntChild é o botão que recebe o event listener
        fetch(`${URLITEM}${getSkuFromProductItem(element)}`) //  getSkuFromProductItem retorna id do produto
        .then(data => data.json()) //  converte p json
        .then(datajson => addToCart(datajson)) // manda p tratar e add to cart
        .catch(error => console.log(error.message));
      });
    });
};

window.onload = function onload() {
  fetch(`${APIURL}${PESQUISA}`)
    .then(data => data.json())
    .then(datajson => gerarLista(datajson.results))
    .catch(error => console.log(error.message));
};
