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
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Fetch to call the infomation related to Id and call createCartItemElement
const fetchId = (idToFecth) => {
  fetch(`https://api.mercadolibre.com/items/${idToFecth}`)
    .then(response => response.json())
    .then((data) => {
      const cartItemElenet = document.getElementsByClassName('cart__items');
      cartItemElenet[0].appendChild(
        createCartItemElement({
          sku: idToFecth,
          name: data.title,
          salePrice: data.price,
        }));
    })
    .catch(error => console.log(error));
};

window.onload = function onload() {
  const query = 'computador';
  const sectionItems = document.getElementsByClassName('items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        sectionItems[0].appendChild(
          createProductItemElement({
            sku: result.id,
            name: result.title,
            image: result.thumbnail,
          }));
      });
    }).catch(error => console.log(error));

  // find the Id of the clicked add to cart button
  document.body.addEventListener('click', function (event) { // To be improve
    const idOfClickedCartButon =
      event.target.previousSibling.previousSibling.previousSibling.innerText; // To be improve
    console.log('idOfClickedCartButon', idOfClickedCartButon);
    fetchId(idOfClickedCartButon);
  });
}; // End of window load
