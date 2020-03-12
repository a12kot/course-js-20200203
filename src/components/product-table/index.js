//import SortableTable from '../sortable-table/index.js';
import InfinityTable from '../infinity-table/index.js';

export const header = [
  {
    id: 'images',
    title: 'Image',
    sortable: false,
    template: data => {
      const url = data[0] ? data[0].url : 'https://upload.wikimedia.org/wikipedia/commons/d/d5/No_sign.svg';
      return `
        <div class="sortable-table__cell">
         <img class="sortable-table-image" alt="Image" src="${url}">
        </div>
      `;
      
    }
  },
  {
    id: 'title',
    title: 'Name',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'subcategory',
    title: 'Category',
    sortable: false,
  },
  {
    id: 'quantity',
    title: 'Quantity',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Price',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'status',
    title: 'Status',
    sortable: true,
    sortType: 'number',
    template: data => {
      const title = data ? "Enable" : 'Disable';
      return `
        <div class="sortable-table__cell">${title}</div>
      `;
    } 
  },  
];

class ProductTable extends InfinityTable {
  constructor(...options) {
    super(header, ...options);
  }
}

export default ProductTable;