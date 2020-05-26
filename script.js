// GLOBALS
const myObject = {
  method: "GET",
  headers: { Accept: "application/json" }
};
const sectionItems = document.getElementsByClassName("items");
const newCart = document.getElementsByClassName("cart__items");
const btnEmpty = document.getElementsByClassName("empty-cart");
const loading = document.getElementsByClassName("loading__title");
const totalPrice = document.getElementsByClassName("total-price");
let cartTotal = 0;
const priceReg = /[^$]\d+/;

function loadingStatus(x) {
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

/* PRODUCTS ELEMENTS FUNCTIONS
  - createProductImageElement(imageSource)
  - createCustomElement(element, className, innerText)
  - createProductItemElement({ sku, name, image })
  - appendItems(data, items)
  - fetchAllItems(query, items) */

function createProductImageElement(imageSource) {
  /* HELPER FUNCTION - Main Function: createProductItemElement()
    Generates img element from API's item's thumbnail
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
  /* HELPER FUNCTION - Main Function: createProductItemElement()
    Generates HTML element according to given arguments
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
  /* HELPER FUNCTION - Main Function: appendItems()
    Generates HTML element according to given arguments
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
  /* HELPER FUNCTION - Main Function: fetchAllItems()
    Appends products from ML API Products Object
    Arguments:
      - data (Object): ML API Products Object
      - items (HTMLCollection): HTMLCollection of all items with .items class
    Returns:
      Nothing */
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

async function fetchAllItems(query, items) {
  /* Fetch data from ML API and append to index.html
    Arguments:
      - query (string): search query for ML API
      - items (HTMLCollection): HTMLCollection of all items with .items class
    Returns:
      Nothing */
  try {
    const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
    // prettier-ignore
    const response = await fetch(API_URL, myObject);
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
  - getSkuFromProductItem(item)
  - cartItemClickListener(event)
  - createCartItemElement({ sku, name, salePrice }
  - fetchCartItem(itemID) */

function getSkuFromProductItem(item) {
  /* HELPER FUNCTION - Main Function: fetchAllItems()
    Retrives Item's SKU from parent <span>
    Arguments:
      - item (HTMLElement)
    Returns:
      - SKU Number (String) */
  return item.querySelector("span.item__sku").innerText;
}

function cartItemClickListener(event) {
  const itemPrice = Number(priceReg.exec(event.target.innerText));
  cartTotal -= itemPrice;
  event.target.remove();
  if (newCart[0].childNodes.length === 0) {
    cartTotal = 0;
  }
  totalPrice[0].innerHTML = Math.round(cartTotal * 100) / 100;
}

function emptyCart() {
  const olAll = document.querySelector(".cart__items");
  olAll.innerHTML = "";
  cartTotal = 0;
  totalPrice[0].innerHTML = 0;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement("li");
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.style.cursor = "pointer";
  li.addEventListener("click", cartItemClickListener);
  return li;
}

function appendAndReturnPrice(data, cart) {
  cart[0].appendChild(
    createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price
    })
  );
  return data.price;
}

async function fetchCartItem(itemID, cartID) {
  try {
    const API_URL = `https://api.mercadolibre.com/items/${itemID}`;
    // prettier-ignore
    const response = await fetch(API_URL, myObject);
    const productData = await response.json();
    const price = await appendAndReturnPrice(productData, cartID);
    cartTotal += Number(price);
    totalPrice[0].innerHTML = Math.round(cartTotal * 100) / 100;
  } catch (error) {
    console.error(error);
  }
}

function appendEventToItems(cart, btns) {
  btns.forEach(e => {
    const idThis = getSkuFromProductItem(e.parentNode);
    e.addEventListener("click", () => {
      fetchCartItem(idThis, cart);
    });
  });
}

function loadCart(cart) {
  const cartItems = localStorage.getItem("todoList");
  const localCart = localStorage.getItem("cartTotal");
  const cartContent = cart;
  if (cartItems !== "undefined") {
    const listContents = JSON.parse(cartItems);
    const sumCart = JSON.parse(localCart);
    cartTotal = Number(sumCart);
    totalPrice[0].innerHTML = cartTotal;
    cartContent[0].innerHTML = listContents;
    const items = document.querySelectorAll(".cart__item");
    items.forEach(e => {
      e.addEventListener("click", cartItemClickListener);
    });
  }
}

function saveCart() {
  localStorage.clear();
  const listContents = newCart[0].innerHTML;
  localStorage.setItem("todoList", JSON.stringify(listContents));
  localStorage.setItem("cartTotal", JSON.stringify(cartTotal));
}

window.onload = function onload() {
  async function loadItems() {
    try {
      loadingStatus("add");
      await loadCart(newCart);
      await btnEmpty[0].addEventListener("click", emptyCart);
      const btns = await fetchAllItems("computador", sectionItems);
      await appendEventToItems(newCart, btns);
    } catch (e) {
      console.error(e);
    }
  }
  loadItems();
};

window.onbeforeunload = function unload() {
  saveCart();
};
