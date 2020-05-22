const secItems = document.querySelector('.items'); // Manipula section items.
const carrinho = document.querySelector('.cart__items');
const btnLimpa = document.querySelector('.empty-cart'); // Manipula o botão que limpa ista.
const loading = document.querySelector('.loading'); // Maniluça o loading.
const total = document.getElementById('total'); // Manipula o span #total.
let tot = 0;
let cart = []; // Array para os ids de cada produto.

const saveToStorage = () => {
  localStorage.setItem('itens_carrinho', JSON.stringify(cart));
};

const limpaLista = () => {
  carrinho.innerText = '';
  cart = [];
  tot = 0;
  total.innerHTML = 'R$ 0,00';
  saveToStorage();
};

btnLimpa.addEventListener('click', limpaLista);

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

const somaTudo = async (price, sinal) => {
  try {
    if (sinal) {
      tot += price;
    } else {
      tot -= price;
    }
    total.innerHTML = tot.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch (err) {
    console.log(err);
  }
};

function cartItemClickListener(event) {
  const pos = event.target.innerText.indexOf('$');
  const valor = event.target.innerHTML.substring(pos + 1);
  somaTudo(valor, false);
  event.target.remove();
  const code = event.target.innerText.substring(5, 18);
  cart.splice(cart.indexOf(code), 1);
  saveToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (code) => {
  fetch(`https://api.mercadolibre.com/items/${code}`)
  .then(responsta => responsta.json())
  .then(({ id, title, price }) => {
    const item = createCartItemElement({ sku: id, name: title, salePrice: price });
    cart.push(id);
    carrinho.append(item);
    somaTudo(price, true);
    saveToStorage();
  })
  .catch(error => console.log(error));
};

const completaAdd = (e) => {
  const code = e.target.parentNode.firstChild.innerText;
  addToCart(code);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', completaAdd);
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(responsta => responsta.json())
  .then((json) => {
    json.results.forEach((prod) => {
      const { id: sku, title: name, thumbnail: image } = prod;
      secItems.append(createProductItemElement({ sku, name, image }));
    });
  })
  .catch(error => console.log(error));
  const salvos = JSON.parse(localStorage.itens_carrinho);
  if (localStorage.itens_carrinho) {
    salvos.forEach(code => addToCart(code));
  }
  loading.style.display = 'block';
  setTimeout(() => (loading.style.display = 'none'), 2100);
};
