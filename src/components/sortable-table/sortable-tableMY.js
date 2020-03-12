export default class SortableTable {
    static BOTTOM_LIMIT = 100;        //distance to buttom border to load new content
    static AMOUNT_LOADED_CONTENT = 5; //amount of loaded content after bottom reached
    $element;                         //HTMLElement;
    data;                             //all data for the table
    amountLoadData;                   //amount of loaded content
    usedSortFeild;                    //sort by asc or desc
    loadedData;                       //aready loaded data

    constructor(amount = 10,  data = {}) {
      this.data = data;
      this.amountLoadData = amount;
      this.loadedData = 0;
      this.render();
      this.initEventListeners();
    }
  
    initEventListeners() {
        document.addEventListener('pointerdown',this.onColumnClick);
        window.addEventListener('scroll', this.onScrollCheck);
    }
    
    onColumnClick = (event) => {
      if (event.target.closest('div').hasAttribute("data-sortable")) {
        let sortFiled = event.target.closest('div').dataset.name;

        this.sortTable(sortFiled);  
      }
    }

    sortTable(type) {//title , quantity, price, enabled
      const tableContainer = this.$element.querySelector('.sortable-table__body');
      const sortNeedArray = Array.from(tableContainer.querySelectorAll('.sortable-table__row'));
      let sortedArr;

      if (this.usedSortFeild !== type) {
        sortedArr = sortNeedArray.sort(this.selectComparator(type));
        this.usedSortFeild = type;
      }
      else {
        sortedArr = sortNeedArray.sort(this.selectComparator(type)).reverse();
        this.usedSortFeild = '';
      }
      
      this.replaceTableWith(tableContainer, sortedArr);     
    }

    replaceTableWith(container,sortedArr) {
      let newTableContainer = document.createElement('div');
      newTableContainer.classList.add("sortable-table__body");

      let tmpString = sortedArr.reduce((str, elem) => {
        return str += elem.outerHTML;
      },'');
  
      newTableContainer.innerHTML = tmpString;
  
      container.parentNode.replaceChild(newTableContainer, container);  
    }

    selectComparator(type) {
      switch (type) {
        case 'title':
          return function(rowA, rowB) {
            return rowA.childNodes[3].textContent.localeCompare(rowB.childNodes[3].textContent);
          }      
        case 'quantity':
          return function(rowA, rowB) {
            return +rowA.childNodes[7].textContent - +rowB.childNodes[7].textContent;
          }
        case 'price':
          return function(rowA, rowB) {
            return +rowA.childNodes[9].textContent - +rowB.childNodes[9].textContent;
          }
        case 'enabled':
          return function(rowA, rowB) {
            return rowA.childNodes[11].textContent.localeCompare(rowB.childNodes[11].textContent);;
          }     
      } 
    }

    onScrollCheck = () => {
        let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
        if (windowRelativeBottom < document.documentElement.clientHeight + SortableTable.BOTTOM_LIMIT) {
            this.loadMoreContent(SortableTable.AMOUNT_LOADED_CONTENT);
        }
    }

    loadMoreContent(amount) {
        const aditionalElementString = this.getLinesBody(amount, this.data);
        let aditionalElement = document.createElement('div');
        aditionalElement.innerHTML = aditionalElementString; 

        let tableContainer = this.$element.querySelector('.sortable-table__body');

        tableContainer.append(aditionalElement);
    }

    getLinesBody(amount, data) {
        this.loadedData += amount;
        return data.
        slice(this.loadedData - amount ,this.loadedData)
        .map(({ id, title, description, quantity, category, subcategory, enabled, images, price}) => {
        return `
        <a href="/products/${id}" class="sortable-table__row">
            <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${images[0]}">
            </div>
            <div class="sortable-table__cell">${title}</div>
            <div class="sortable-table__cell">
            <span data-tooltip="<div class=&quot;sortable-table-tooltip&quot;>
                <span class=&quot;sortable-table-tooltip__category&quot;>${category}</span> /
                <b class=&quot;sortable-table-tooltip__subcategory&quot;>${subcategory}</b>
            </div>">${subcategory}</span>
            </div>
            <div class="sortable-table__cell">${quantity}</div>
            <div class="sortable-table__cell">$${price}</div>
            <div class="sortable-table__cell">${enabled}</div>
        </a>
        `;})
      .join('');
      this.loadedData += amount;
    }

    render() {
      this.$element = document.createElement('div');
      this.$element.innerHTML = `
      <div data-elem="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-elem="header" class="sortable-table__header sortable-table__row">
          <div class="sortable-table__cell" data-name="images">
          <span>Image</span>
          </div>
          <div class="sortable-table__cell" data-name="title" data-sortable="">
            <span>Name</span>
            <span class="sortable-table__sort-arrow">
              <span class="sortable-table__sort-arrow_asc"></span>
            </span>
          </div>
          <div class="sortable-table__cell" data-name="category">
            <span>Category</span>
          </div>
          <div class="sortable-table__cell" data-name="quantity" data-sortable="">
            <span>Quantity</span>
          </div>
          <div class="sortable-table__cell" data-name="price" data-sortable="">
            <span>Price</span>
          </div>
          <div class="sortable-table__cell" data-name="enabled" data-sortable="">
            <span>Status</span>
          </div>
        </div>
        <div data-elem="body" class="sortable-table__body">
        ${this.getLinesBody(this.amountLoadData, this.data)}
         </div>
         <div data-elem="loading" class="loading-line sortable-table__loading-line"></div>
         <div data-elem="emptyPlaceholder" class="sortable-table__empty-placeholder">
           <div>
             <p>No products satisfies your filter criteria</p>
             <button type="button" class="button-primary-outline">Reset all filters</button>
           </div>
         </div>         
        </div>
        `;
    }
  
    remove () {
      this.$element.remove();
      document.removeEventListener('pointerdown',this.onColumnClick);
      window.removeEventListener('scroll', this.onScrollCheck);
    }
  
    destroy() {
      this.$element.remove();
      document.removeEventListener('pointerdown',this.onColumnClick);
      window.removeEventListener('scroll', this.onScrollCheck);
    }
    
  }
  