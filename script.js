// Global Variables and localStorage functions
const sectionItems = document.getElementsByClassName("items");
const newCart = document.getElementsByClassName("cart__items");
const btnEmpty = document.getElementsByClassName("empty-cart");
const loading = document.getElementsByClassName("loading__title");
const totalPrice = document.getElementsByClassName("total-price");

function getLSCart() {
  /* Fetches cart data from localStorage
    Arguments:
      - None
    Returns:
      - Cart array or Empty array */
  const cart = JSON.parse(localStorage.getItem("CART_CONTENTS"));
  return cart || [];
}

let shoppingCart = getLSCart();

/* Product Display Functions
  - loadingStatus(x)
  - createProductImageElement(imageSource)
  - createCustomElement(element, className, innerText)
  - createProductItemElement({ sku, name, image })
  - appendItems(data, items)
  - loadPageItems(query, items) */

function loadingStatus(x) {
  /* Inserts or removes "LOADING" message on page
    Arguments:
      - x (String): "add" or "del"
    Returns:
      - Nothing */
  if (x === "add") {
    const span = document.createElement("span");
    span.className = "loading";
    span.innerText = "LOADING";
    loading[0].appendChild(span);
  } else if (x === "del") {
    const loadingBar = document.querySelector(".loading");
    loadingBar.remove();
  }
}

function createProductImageElement(imageSource) {
  /* Generates img element from API's item's thumbnail
    Arguments:
      - imageSource (URL): source of thumbnail (e.g.:"http://www.google.com/image.jpeg")
    Returns:
      - img (HTMLElement) */
  const img = document.createElement("img");
  img.className = "item__image";
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  /* Generates HTML element according to given arguments
    Arguments:
      - element (string): type of element (e.g.: "img", "span", etc)
      - className (string): append class name to element
      - innerText (string): tag's content e.g.: "<span>innerText</span>"
    Returns:
      - e (HTMLElement): full HTMLElement to be appended */
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  /* Generates HTML element according to given arguments
    Arguments:
      - sku (string): id value from ML API product data object
      - name (string): name value from ML API product data object
      - image (string): image value ML API product data object
    Returns:
      - section (HTMLElement): full HTMLElement to be appended */
  const section = document.createElement("section");
  section.className = "item";

  section.appendChild(createCustomElement("span", "item__sku", sku));
  section.appendChild(createCustomElement("span", "item__title", name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement("button", "item__add", "Adicionar ao carrinho!")
  );

  return section;
}

function appendItems(data, items) {
  /* Appends products from ML API Products Object
    Arguments:
      - data (Object): ML API Products Object
      - items (HTMLCollection): HTMLCollection of all items with .items class
    Returns:
      - Nothing */
  data.results.forEach(result => {
    const itemData = createProductItemElement({
      sku: result.id,
      name: result.title,
      image: result.thumbnail
    });
    items[0].appendChild(itemData);
  });
  return document.querySelectorAll(".item__add");
}

async function loadPageItems(query, items) {
  /* Fetch data from ML API and append to index.html
    Arguments:
      - query (string): search query for ML API
      - items (HTMLCollection): HTMLCollection of all items with .items class
    Returns:
      - Nothing */
  try {
    const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
    await loadingStatus("add");
    const response = await fetch(API_URL);
    const data = await response.json();
    await setTimeout(loadingStatus, 3000, "del");
    const btns = await appendItems(data, items);
    return btns;
  } catch (e) {
    console.error(e);
  }
  return true;
}

/* CART ELEMENTS FUNCTIONS
  - updateTotal()
  - addToLSCart(data)
  - emptyCart()
  - setClearBtn()
  - getElementSku(item)
  - cartItemClickListener(event)
  - createCartItemElement({ sku, name, salePrice }
  - appendCartToPage(data, type)
  - addItemToCart(itemID)
  - setAddToCartBtn(btns)
  - loadCart() */

function updateTotal() {
  /* Sum cart total from shoppingCart Array and append info to HTML
    Arguments:
      - None
    Returns:
      - Nothing */
  let total = 0;
  if (shoppingCart.length > 0) {
    total = shoppingCart.reduce((acc, cur) => acc + cur.salePrice, 0);
  }
  totalPrice[0].innerText = total;
}

function addToLSCart(data) {
  /* Updates cart data in localStorage
    Arguments:
      - data (object): item to append do cart array
    Returns:
      - Nothing */
  if (!data) {
    shoppingCart = [];
  } else {
    shoppingCart.push(data);
  }
  localStorage.setItem("CART_CONTENTS", JSON.stringify(shoppingCart));
  // Updating Cart Total
  updateTotal();
}

function emptyCart() {
  /* Empties cart
    Arguments:
      - None
    Returns:
      - Nothing */
  const olAll = document.querySelector(".cart__items");
  olAll.innerHTML = "";
  // Update localStorage data with empty array
  addToLSCart();
}

function setClearBtn() {
  /* Sets event listener on <button class="empty-cart">
    Arguments:
      - None
    Returns:
      - Nothing */
  btnEmpty[0].addEventListener("click", emptyCart);
}

function getElementSku(item) {
  /* Retrives Item's SKU from parent <span>
    Arguments:
      - item (HTMLElement): <section class="item"> from main page
    Returns:
      - SKU Number (Number) */
  return item.querySelector("span.item__sku").innerText;
}

function cartItemClickListener(event) {
  /* Removes current item from cart
    Arguments:
      - event (Mouseevent)
    Returns:
      - Nothing */
  const itemSku = event.target.querySelector(".cart__sku").innerText;
  const itemIndex = shoppingCart.findIndex(e => e.sku === itemSku);
  shoppingCart.splice(itemIndex, 1);
  localStorage.setItem("CART_CONTENTS", JSON.stringify(shoppingCart));
  updateTotal();
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  /* Creates <li> with item info
    Arguments:
      - { sku, name, salePrice } (Object): Parsed item info from ML API
    Returns:
      - <li> with item info (HTMLElement) */
  const li = document.createElement("li");
  li.className = "cart__item";
  li.innerHTML = `SKU: <span class="cart__sku">${sku}</span> | NAME: ${name} | PRICE: $${salePrice}`;
  li.style.cursor = "pointer";
  li.addEventListener("click", cartItemClickListener);
  return li;
}

function appendCartToPage(data, type) {
  /* Appends item data to <ol class="cart__items">
  Arguments:
    - data (Object): item to be appended
    - type (String): specifies if data is already parsed
  Returns:
    - formatted item (Object) */
  const formatData = {
    sku: data.id,
    name: data.title,
    salePrice: data.price
  };
  if (type === "processed") {
    formatData.sku = data.sku;
    formatData.name = data.name;
    formatData.salePrice = data.salePrice;
  }
  newCart[0].appendChild(createCartItemElement(formatData));
  return formatData;
}

async function addItemToCart(itemID) {
  /* Async function to handle API request and item insertion
  Arguments:
    - itemID (String): item to be appended
  Returns:
    - Nothing */
  try {
    const API_URL = `https://api.mercadolibre.com/items/${itemID}`;
    const response = await fetch(API_URL);
    const rawProductData = await response.json();
    const itemData = await appendCartToPage(rawProductData);
    addToLSCart(itemData);
  } catch (error) {
    console.error(error);
  }
}

function setAddToCartBtn(btns) {
  /* Insert event handlers on main page buttons
  Arguments:
    - btns (NodeList): buttons
  Returns:
    - Nothing */
  btns.forEach(e => {
    const idThis = getElementSku(e.parentNode);
    e.addEventListener("click", () => {
      addItemToCart(idThis, newCart);
    });
  });
}

function loadCart() {
  /* Load cart from localStorage to HTML
  Arguments:
    - None
  Returns:
    - Nothing */
  shoppingCart.forEach(e => {
    appendCartToPage(e, "processed");
  });
  const items = document.querySelectorAll(".cart__item");
  items.forEach(e => {
    e.addEventListener("click", cartItemClickListener);
  });
  // Updating Cart Total
  updateTotal();
}

async function loadItems() {
  /* Async handling of events on page
  Arguments:
    - None
  Returns:
    - Nothing */
  try {
    setClearBtn();
    await loadCart();
    const btnsItems = await loadPageItems("computador", sectionItems);
    await setAddToCartBtn(btnsItems);
  } catch (e) {
    console.error(e);
  }
}

window.onload = function onload() {
  loadItems();
};
