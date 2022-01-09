const axios = require('axios');

export let page = 1;
export const perPage = 40;

export default class ApiSearchingPictures {
  constructor() {
    this.baseUrl = 'https://pixabay.com/api';
    this.key = '24832608-305c442589436875a767f01eb';
    this.searchQuery = '';
    this.imageType = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = 'true';
  }

  async getPictures() {
    const url = `${this.baseUrl}/?key=${this.key}&q=${this.searchQuery}&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${this.safesearch}&page=${page}&per_page=${perPage}`;

    const response = await axios.get(url);
    this.incrementPage();
    return response.data;
  }

  incrementPage() {
    page += 1;
  }

  resetPage() {
    page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
