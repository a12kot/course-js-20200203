import Tooltip from '../../components/tooltip/index';
import RangePicker  from '../../components/range-picker/index.js';
import ColumnChart  from '../../components/column-chart/index.js';
import BestsellerTable from '../../components/bestseller-table/index.js';
import fetchJson from '../../utils/fetch-json.js'

const BACKEND_URL = 'https://course-js.javascript.ru/';
const BESTSELLERS = 'api/dashboard/bestsellers';
const ORDERS      = 'api/dashboard/orders';
const SALES       = 'api/dashboard/sales';
const CUSTOMERS   = 'api/dashboard/customers';

const urlBestsellers  = new URL(BESTSELLERS, BACKEND_URL);
const urlOrders       = new URL(ORDERS, BACKEND_URL);
const urlSales        = new URL(SALES, BACKEND_URL);
const urlCustomers    = new URL(CUSTOMERS, BACKEND_URL);

const rangePickerRoot = document.getElementById('range-picker-root');
const columnChartRoot = document.getElementById('charts-root');
const bestsellerTableRoot = document.getElementById('bestseller-table-root');

const rangeFrom = new Date(2020, 1, 1);
const rangeTo = new Date(2020, 1, 8);

const positionsBestsellers = 10;

const rangePicker = new RangePicker({
  from: rangeFrom,
  to: rangeTo,
})

const ordersColumnChart = new ColumnChart([], {
  label: 'orders',
  value: 0,
  link: '#'
});

const salesColumnChart = new ColumnChart([], {
  label: 'sales',
  value: '$0'
});

const customerColumnChart = new ColumnChart([], {
  label: 'customers',
  value: 0
});

const bestsellerTable = new BestsellerTable({ isSortLocally: true });

rangePickerRoot.append(rangePicker.$element);

ordersColumnChart.$element.classList.add('dashboard__chart_orders');
columnChartRoot.append(ordersColumnChart.$element);

salesColumnChart.$element.classList.add('dashboard__chart_sales');
columnChartRoot.append(salesColumnChart.$element);

customerColumnChart.$element.classList.add('dashboard__chart_orders');
columnChartRoot.append(customerColumnChart.$element);

bestsellerTableRoot.append(bestsellerTable.$element);

async function onLoad () {
  urlBestsellers.searchParams.set('_start', 1);
  urlBestsellers.searchParams.set('_end', positionsBestsellers);
  
  const bestsellers = await fetchJson(urlBestsellers);

  bestsellerTable.addRows(bestsellers);

  bestsellerTableRoot.append(bestsellerTable.$element);
  
  chartsUpdate(rangeFrom, rangeTo);

  rangePicker.$element.addEventListener('date-select', async range => {

    chartsUpdate(range.detail.from, range.detail.to)

  });

  function normalizeData (orders) {
    const nArr = [];

    const maxValue = Math.max(...Object.values(orders));

    let sum = Object.entries(orders).reduce((accum, item) => {
      item.push(Math.floor(item[1]/maxValue * 50));
      nArr.push(item);
      return accum += item[1];
    },0);

    return [sum, nArr];
  }

  async function chartsUpdate(from, to) {
    urlOrders.searchParams.set('from', `${from.toISOString()}`);
    urlOrders.searchParams.set('to', `${to.toISOString()}`);
    urlSales.searchParams.set('from', `${from.toISOString()}`);
    urlSales.searchParams.set('to', `${to.toISOString()}`);
    urlCustomers.searchParams.set('from', `${from.toISOString()}`);
    urlCustomers.searchParams.set('to', `${to.toISOString()}`);

    const orders = await fetchJson(urlOrders);
    const sales = await fetchJson(urlSales);
    const customers = await fetchJson(urlCustomers);

    const normOrders = normalizeData(orders);
    const normSales = normalizeData(sales);
    const normCustomers = normalizeData(customers);

    ordersColumnChart.updateData (normOrders[0], normOrders[1]);
    salesColumnChart.updateData ('$' + normSales[0], normSales[1]);
    customerColumnChart.updateData (normCustomers[0], normCustomers[1]);      
  }
  
}    

onLoad();

new Tooltip();

const toggle = document.querySelector('.sidebar__toggler');

toggle.addEventListener('pointerdown', () => {
  document.body.classList.contains('is-collapsed-sidebar') ? 
    document.body.classList.remove('is-collapsed-sidebar') :
    document.body.classList.add('is-collapsed-sidebar');
})