
class RangePicker {
    static startDate;
    
    constructor() {
      this.calendarButton  = document.querySelector(".rangepicker__input");
      this.calendarDates   = document.querySelector(".rangepicker__selector");
      //используем бинд на сам класс
      this.calendarButton.addEventListener("click", this.onClickCalcBtn.bind(this));
      this.calendarDates.addEventListener("click", this.onClickCalcDate.bind(this));
    }
    //открытие\закрытие пикера
    onClickCalcBtn(event) {
      if (!event.target.className               === "rangepicker__input" ||
          !event.target.parentElement.className === "rangepicker__input") return;
      
      this.showCalendar();
    }
    //выбор периода в пикере
    onClickCalcDate(event) {
      if (!event.target.className === "rangepicker__cell") return;
      
      this.markDate(event.target);
      //если последний день помечен помечаем между ними
      if (RangePicker.startDate === 2) this.markRange();
    }
    
    showCalendar() {
      let calendarBody = document.querySelector('.rangepicker__selector');
        calendarBody.style.display = calendarBody.style.display === "none" ? "inline-flex" :"none";
    }  
    
    markDate(elem) {
      //в зависимости RangePicker.startDate помечаем первый или последний день
      if (RangePicker.startDate === 1) {
        this.addClassToElement(elem, "rangepicker__selected-to");
        RangePicker.startDate = 2;
        return;
      }
      //первый день очищаем весь календарь
      this.cleanRange();
      this.addClassToElement(elem, "rangepicker__selected-from");
      RangePicker.startDate = 1;
    }
    
    markRange() {
      let allDates = document.querySelectorAll("button.rangepicker__cell");
      let addClass = "";
      for (let date of allDates) {
        if (date.className === "rangepicker__cell rangepicker__selected-to") {
          break;
        }
        
        if (addClass) {
          this.addClassToElement(date, addClass);
        }
        
        if (date.className === "rangepicker__cell rangepicker__selected-from") {
          addClass = "rangepicker__selected-between";
        }
      }
    }
    
    cleanRange() {
      let allDates = document.querySelectorAll("button.rangepicker__cell");
      for (let date of allDates) {
        this.removeClassfromElement(date, "rangepicker__selected-between");
        this.removeClassfromElement(date, "rangepicker__selected-from");
        this.removeClassfromElement(date, "rangepicker__selected-to")
      }
    }
    
    addClassToElement(elem, className) {
      elem.classList.add(className);
    }
  
    removeClassfromElement(elem, className) {
      elem.classList.remove(className);
    }  
    
    destroy() {
      this.calendarButton.removeEventListener("click", this.onClickCalcBtn.bind(this));
      this.calendarDates.removeEventListener("click", this.onClickCalcDate.bind(this));
    }
  }