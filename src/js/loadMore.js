export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);
    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {
      button: document.querySelector(selector),
    };
    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.button.textContent = 'Load more';
    this.refs.button.classList.remove('loader');
    this.refs.button.classList.add('search-form__button');
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.button.textContent = '';
    this.refs.button.classList.remove('search-form__button');
    this.refs.button.classList.add('loader');
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
