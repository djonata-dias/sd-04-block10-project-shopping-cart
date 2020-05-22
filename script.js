const getProductsFromLocalStorage = () =>
  JSON.parse(localStorage.products);

const sumCartPrices = () => {
  const prices = document.querySelector('.total-price');
  const sum = getProductsFromLocalStorage().reduce(
    (acc, product) => acc + product.price, 0);
  prices.innerText = sum;
  return sum;
};

const asyncSum = async () => {
  try {
    await sumCartPrices();
  } catch (erro) {
    console.log(erro);
  }
};

const clearCart = () => {
  const cart = document.querySelector('.cart__items');
  const items = document.getElementsByClassName("cart__item");
  while(items.length > 0){
    items[0].remove()
  }
  localStorage.setItem('products', JSON.stringify([]));
  asyncSum();
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  element = event.target;
  if (element) {
    element.parentNode.removeChild(element);
    const products = JSON.parse(localStorage.getItem('products'));
    if (products) {
      const ProductId = products.findIndex(
        product => product.id === event.target.id,
      );
      const filteredProducts = products
        .slice(0, ProductId)
        .concat(products.slice(ProductId + 1, products.lenght));
      localStorage.setItem('products', JSON.stringify(filteredProducts));
    }
  } else {
    console.log('Sem produtos para remover');
  }
  asyncSum();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.id = id;
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      fetch(`https://api.mercadolibre.com/items/${id}`)
        .then(object => object.json())
        .then((data) => {
          const cart = document.querySelector('.cart__items');
          cart.appendChild(createCartItemElement(data));

          const products = JSON.parse(localStorage.getItem('products'));
          const { title, price } = data;
          products.push({ id, title, price });
          localStorage.setItem('products', JSON.stringify(products));
        })
        .then(() => asyncSum());
    });
  }
  return e;
}

function createProductItemElement({
  id = 'teste',
  title = 'teste',
  thumbnail = 'teste',
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', id),
  );
  return section;
}

const appendToItems = (data) => {
  const items = document.querySelector('.items');
  data.results.forEach((product) => {
    items.appendChild(createProductItemElement(product));
  });
};

window.onload = () => {
  const cart = document.querySelector('.cart__items');
  const emptyCart = document.querySelector('.empty-cart');
  const loading = document.querySelector('.loading');

  asyncSum();

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(object => object.json())
    .then(data => appendToItems(data))
    .catch(erro => console.log(erro));

  // .then(loading.parentNode.removeChild(loading)) retirado para colocar setTimeOut

  if (localStorage.products) {
    const products = JSON.parse(localStorage.products);
    products.forEach(product =>
      cart.appendChild(createCartItemElement(product)),
    );
  } else {
    localStorage.products = JSON.stringify([]);
  }

  emptyCart.addEventListener('click', () => clearCart());

  setTimeout(() => {
    loading.remove();
  }, 500);
};
