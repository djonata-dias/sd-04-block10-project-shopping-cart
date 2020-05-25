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

const salvarNoLocal = () => {
  localStorage.setItem('carrinho', document.querySelector('.cart__items').innerHTML);
};

//  function getSkuFromProductItem(item) {
//    return item.querySelector('span.item_sku').innerText;
//  }

async function somaProdutos({ salePrice }) {
  let valorTotal = 0;
  const prices = document.getElementsByClassName('total-price')[0];
  if (localStorage.valorTotal) {
    const valorStorage = localStorage.getItem('valorTotal');
    valorTotal = +valorStorage + +salePrice;
  } else {
    valorTotal = +salePrice;
  }
  prices.innerText = valorTotal;
  localStorage.setItem('valorTotal', valorTotal);
}

function cartItemClickListener(event) {
  event.target.remove();
  salvarNoLocal();
  const elemValue = event.target.innerText.split(' | ')[2].substr(8); // pega Id do evento
  const newValue = localStorage.getItem('valorTotal') - elemValue;
  localStorage.setItem('valorTotal', newValue);
  somaProdutos({ salePrice: '0' });
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
      salvarNoLocal();
      somaProdutos(parameter);
    })
    .catch(console.error);
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
    localStorage.clear();
    somaProdutos({ salePrice: '0' });
  });
}

function getItensLocalStorage() {
  ItensCarrinho = localStorage.getItem('carrinho');
  document.querySelector('.cart__items').innerHTML = ItensCarrinho;
  document
    .querySelectorAll('li')
    .forEach(li => li.addEventListener('click', cartItemClickListener));
}

async function initial(query) {
  document.getElementById('items').innerHTML = '';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then(response => response.json())
  .then(data => buscarElemento(data.results))
  .catch(console.error);
}

window.onload = function onload() {
  initial('livros');
  const query = document.getElementById('entrada');
  query.addEventListener('change', () => initial(query.value));
  setTimeout(() => {
    document.getElementsByClassName('loading')[0].remove();
  }, 500);
  if (localStorage.carrinho) {
    getItensLocalStorage();
    somaProdutos({ salePrice: '0' });
  }
};
