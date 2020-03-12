export default class Tooltip {
  static instance = null;

  onMouseOver = event => {
    const $element = event.target.closest('[data-tooltip]');

    if ($element) {
      this.render($element.dataset.tooltip);
      this.moveTooltip(event);

      document.addEventListener('pointermove', this.onMouseMove);
    }
  };

  onMouseMove = event => {
    this.moveTooltip(event);
  };

  onMouseOut = () => {
    this.removeTooltip();
  };

  removeTooltip() {
    if (this.$elem) {
      this.$elem.remove();
      this.$elem = null;

      document.removeEventListener('pointermove', this.onMouseMove);
    }
  }

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    this.initEventListeners();

    Tooltip.instance = this;
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.onMouseOver);
    document.addEventListener('pointerout', this.onMouseOut);
  }

  render(html) {
    this.$elem = document.createElement('div');
    this.$elem.className = 'tooltip';
    this.$elem.innerHTML = html;

    document.body.append(this.$elem);
  }

  moveTooltip(event) {
    const left = event.clientX + 10;
    const top = event.clientY + 10;

    // TODO: Add logic for window borders

    this.$elem.style.left = left + 'px';
    this.$elem.style.top = top + 'px';
  }

  destroy() {
    document.removeEventListener('pointerover', this.onMouseOver);
    document.removeEventListener('pointerout', this.onMouseOut);
    this.removeTooltip();
  }
}