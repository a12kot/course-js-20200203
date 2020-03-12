export default class ToolTip {
    constructor() {
      //используем бинд на сам класс
      document.addEventListener("mouseover", this.onMouseOver.bind(this));
      document.addEventListener("mouseout", this.onMouseOut.bind(this));
    }
  
    onMouseOver(event) {
      let tooltipHtml = event.target.dataset.tooltip;
      if (!tooltipHtml) return;    
      
      this.render(event);
      //меняем положение если мышь двигается внутри элемента
      event.target.addEventListener("mousemove",this.moveAt.bind(this)) ;
    }
    
    onMouseOut(event) {
      if (this.$element) {
        this.$element.remove();
      }
      event.relatedTarget.removeEventListener("mousemove",this.moveAt.bind(this)) ;
    };
  
  
    render(event) {
      this.$element = document.createElement('div');
      this.$element.className = 'tooltip';
      this.$element.innerHTML = event.target.dataset.tooltip; 
      document.body.append(this.$element);
      
      this.moveAt(event);
    }
    
    moveAt(event) {
      //проверяем уход за экран
      let left = event.clientX + 10;
      if (left + this.$element.offsetWidth > document.documentElement.clientWidth) {
        left -= this.$element.offsetWidth - 10; 
      }
      
      let top = event.clientY + 10;
      if (top + this.$element.offsetHeigth > document.documentElement.clientHeight) { 
        top -= this.$element.offsetHeight - 10;
      }
      //назначаем новые координаты
      this.$element.style.left  = left + 'px'; 
      this.$element.style.top   = top + 'px';     
    }    
      
    destroy() {
      this.$element.remove();
      event.target.removeEventListener("mousemove",this.moveAt.bind(this)) ;
      document.removeEventListener("mouseover", this.onMouseOver.bind(this));
      document.removeEventListener("mouseout", this.onMouseOut.bind(this));
    }
  }