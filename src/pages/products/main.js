import ProductTable from '../../components/product-table/index.js';
import fetchJson from '../../utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';
const PRODUCTS = 'api/rest/products';
const url = new URL(PRODUCTS, BACKEND_URL);

const step = 10;
let start = 0;
let end = 20;

const productTableRoot = document.getElementById('product-table-root');

const productTable = new ProductTable({ isSortLocally: true });

async function onLoad () {
  url.searchParams.set('_start', 1);
  url.searchParams.set('_end', 20);
  
  const products = await fetchJson(url);

  productTable.addRows(products);

  productTableRoot.append(productTable.$element);
  
  productTable.$element.addEventListener('load-data', async () => {
    
    start = end;
    end += step;

    url.searchParams.set('_start', `${start}`);
    url.searchParams.set('_end', `${end}`);
    
    const products = await fetchJson(url);

    productTable.addRows(products);
  });
}

onLoad();