// GLOBALS
const myObject = {
  method: "GET",
  headers: { Accept: "application/json" }
};

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
  - createCartItemElement({ sku, name, salePrice })
  - appendCart(data)
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
  console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement("li");
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener("click", cartItemClickListener);
  return li;
}

function fetchCartItem(itemID, cartID) {
  const API_URL = `https://api.mercadolibre.com/items/${itemID}`;
  // prettier-ignore
  fetch(API_URL, myObject)
    .then((response) => response.json())
    .then((productData) => {
      cartID.appendChild(
        createCartItemElement({
          sku: productData.id,
          name: productData.title,
          salePrice: productData.price
        })
      );
    })
    .catch(error => console.log(error.message));
}

function appendCart(cart, btns) {
  btns.forEach(e => {
    const idThis = getSkuFromProductItem(e.parentNode);
    e.addEventListener("click", () => {
      fetchCartItem(idThis, cart);
    });
  });
}

window.onload = function onload() {
  async function loadItems() {
    try {
      const sectionItems = await document.querySelectorAll(".items");
      const newCart = await document.querySelector(".cart__items");
      const btns = await fetchAllItems("computador", sectionItems);
      await appendCart(newCart, btns);
    } catch (e) {
      console.error(e);
    }
  }
  loadItems();
};
