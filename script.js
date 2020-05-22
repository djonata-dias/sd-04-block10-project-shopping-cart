  function cartItemClickListener(event) {
    // coloque seu código aqui
    event.target.remove();
  }

  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }

  const getItemsStorage = () => {
    let cartItems = [];
    if (localStorage.getItem('cart')) {
      cartItems = JSON.parse(localStorage.getItem('cart'));
    }
    return cartItems;
  };

  const saveStorage = (item) => {
    const cartItems = getItemsStorage();
    cartItems.push(item);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const insertCartItem = (item, save = true) => {
    const cartItems = document.querySelector('.cart__items');
    const cartItem = {};
    cartItem.sku = item.id;
    cartItem.name = item.title;
    cartItem.salePrice = item.price;
    const itemLi = createCartItemElement(cartItem);
    cartItems.appendChild(itemLi);
    if (save) saveStorage(item);
  };

  function createCustomElement(element, className, innerText, sku) {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    e.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then(product => insertCartItem(product));
    });
    return e;
  }

  function createProductImageElement(imageSource) {
    const img = document.createElement('img');
    img.className = 'item__image';
    img.src = imageSource;
    return img;
  }

  function createProductItemElement({ sku, name, image }) {
    const section = document.createElement('section');
    section.className = 'item';

    section.appendChild(createCustomElement('span', 'item__sku', sku));
    section.appendChild(createCustomElement('span', 'item__title', name));
    document.getElementsByClassName('items')[0].appendChild(section);
    section.appendChild(createProductImageElement(image));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

    return section;
  }

  const returnProduct = (results) => {
    const product = {};
    results.forEach((item) => {
      product.sku = item.id;
      product.name = item.title;
      product.image = item.thumbnail;
      const section = createProductItemElement(product);
      document.getElementsByClassName('items')[0].appendChild(section);
    });
  };

  const verifyCart = () => {
    if (localStorage.cart) {
      const cartItems = getItemsStorage();
      cartItems.forEach(item => insertCartItem(item, false));
    } else {
      localStorage.setItem('cart', '');
    }
  };

  // function getSkuFromProductItem(item) {
    //   return item.querySelector('span.item__sku').innerText;
    // }

  window.onload = function onload() {
    const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    fetch(API_URL)
    .then(response => response.json())
    .then(data => returnProduct(data.results));

    verifyCart();
  };
