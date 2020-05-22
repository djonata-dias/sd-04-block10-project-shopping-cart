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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item_sku').innerText;
}

function saveProductsCart (produto) {
  console.log(produto)
  let carrinho = [];
  if (localStorage.carrinho) {
    carrinho = JSON.parse(localStorage.getItem('carrinho'));
  }
  carrinho.push(produto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho))
}

function cartItemClickListener(event) {
  event.target.remove();
  const elemId = event.target.innerText.split(' | ')[0].substr(5); // pega Id do evento
  const ItensCarrinho = getItensLocalStorage(); // pega os itens armazenados
  const elemRemove = ItensCarrinho.find(item => item.sku == elemId);
  ItensCarrinho.splice(ItensCarrinho.indexOf(elemRemove), 1);
  localStorage.setItem('carrinho', JSON.stringify(ItensCarrinho));
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.getElementsByClassName('cart__items')[0];
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', event => cartItemClickListener(event));
  ol.appendChild(li);
  return li;
}

function getProductForCarItem(event) {
  const eventPai = event.target.parentNode;
  const numeroSku = eventPai.children[0].innerText;
  fetch(`https://api.mercadolibre.com/items/${numeroSku}`)
    .then(resolve => resolve.json())
    .then((data) => {
      const parameter = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      createCartItemElement(parameter);
      saveProductsCart(parameter)
      somaProdutos(parameter)
    })
    .catch(console.error);
}

async function somaProdutos ({salePrice}) {
  const prices = document.getElementsByClassName('total-price')[0];
  const totalPrices = 0;
  totalPrices += salePrice
}

function getItensLocalStorage () {
  let ItensCarrinho = [];
  if (localStorage.getItem('carrinho')) {
    ItensCarrinho = JSON.parse(localStorage.getItem('carrinho'))
  }
  return ItensCarrinho
}

// criando a chamada do função que busca o elemento.
function buscarElemento(result) {
  const product = { sku: '', name: '', image: '' };
  const produtos = result;
  produtos.map((elem) => {
    product.sku = elem.id;
    product.name = elem.title;
    product.image = elem.thumbnail;
    document
      .getElementById('items')
      .appendChild(createProductItemElement(product));
    return product;
  });
  const clickCart = document.querySelectorAll('.item__add');
  clickCart.forEach(index =>
    index.addEventListener('click', event => getProductForCarItem(event)),
  );
  const limparCarrinho = document.getElementsByClassName('empty-cart')[0];
  limparCarrinho.addEventListener('click', () => {
    const carroDeCompras = document.getElementsByClassName('cart__items')[0];
    while (carroDeCompras.firstChild) {
      carroDeCompras.removeChild(carroDeCompras.firstChild);
    }
    localStorage.clear()
  });
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => buscarElemento(data.results))
    .catch(console.error);
  if (localStorage.carrinho) {
    const ItensCarrinho = getItensLocalStorage();
    ItensCarrinho.forEach(item => createCartItemElement(item));
  } else {
    localStorage.setItem('carrinho', '');
  }
};
