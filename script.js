const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const productInfo = (results) => {
  const product = {};
  results.forEach((item) => {
    product.sku = item.id;
    product.name = item.title;
    product.image = item.thumbnail;
    const section = createProductItemElement(product);
    document.getElementsByClassName('items')[0].appendChild(section);
  });
};

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => productInfo(data.results))
    .catch(console.error);
};
