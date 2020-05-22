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

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function storeCart() { // To be improved
  const cartListOl = document.getElementsByClassName('cart__items');
  localStorage.setItem('cartItem', cartListOl[0].innerHTML);
}

// Fetch to call the infomation related to Id and call createCartItemElement
function fetchId(idToFecth) {
  fetch(`https://api.mercadolibre.com/items/${idToFecth}`)
    .then(response => response.json())
    .then((data) => {
      const cartItemElenet = document.getElementsByClassName('cart__items');
      cartItemElenet[0].appendChild(
        createCartItemElement({
          sku: idToFecth,
          name: data.title,
          salePrice: data.price,
        }),
      );
      storeCart();
    })
    .catch(error => console.log(error));
}

function removeCartItems() {
  const cartListOl = document.getElementsByClassName('cart__items');
  while (cartListOl[0].firstChild) {
    cartListOl[0].removeChild(cartListOl[0].firstChild);
  }
  storeCart();
}


function loadCart() { // To be improved
  console.log(localStorage.getItem('cartItem'));
  const cartListOl = document.getElementsByClassName('cart__items');
  cartListOl[0].innerHTML = localStorage.getItem('cartItem');
}

window.onload = function onload() {
  loadCart();
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
    })
    .catch(error => console.log(error));
  // find the Id of the clicked add to cart button
  document.body.addEventListener('click', function (event) {
    console.log(event.target.className); // to remove
    if (event.target.className === 'item__add') {
      fetchId(
        event.target.previousSibling.previousSibling.previousSibling.innerText,
      ); // To be improved
    }
    if (event.target.className === 'empty-cart') removeCartItems();
  });
}; // End of window load
