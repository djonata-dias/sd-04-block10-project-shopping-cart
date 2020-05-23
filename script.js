
// função para criar imagem do produto.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Função que Cria os Buttons e addo listener com a função para jogar no carrinho.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    moveToCart(e)
  }
  return e;
}

// função para criar lista de produtos retornados da API.
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// Pega o ID da section que o addlistener está!
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// função para acessa a section
const moveToCart = e => {
  e.addEventListener('click', function () {
    return getSkuFromProductItem(e.parentNode)
  })
}

// function cartItemClickListener(event) {
// }


// Função que cria o elemento no Carrinho de compras.
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// }
// feitos

const query = 'computador';

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const pegaInfos = ({ id, title, salePrice, thumbnail }, callback) => {
  const obj = {
    sku: id,
    name: title,
    price: salePrice,
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


const request2 = async (id) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const productJson = await response.json();
    console.log(productJson);
  } catch (error) {
    console.log(`ERROR: ${error}`)
  }
}

window.onload = () => {
  criaList();

};


