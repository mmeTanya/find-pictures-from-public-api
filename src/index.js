import PictureCard from './templates/picture_card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiSearchingPictures from './js/getPictures';
import LoadMoreBtn from './js/loadMore';
import './sass/main.css';
import { page, perPage } from './js/getPictures';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const apiSearchingPictures = new ApiSearchingPictures();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', getPictures);

function onSearch(e) {
  e.preventDefault();

  apiSearchingPictures.query = e.currentTarget.searchQuery.value;

  apiSearchingPictures.resetPage();
  clearGallery();
  getPictures();
}

async function getPictures() {
  if (apiSearchingPictures.query === '') {
    alarmErrorNoQuerry();
    return;
  }
  loadMoreBtn.show();
  loadMoreBtn.disable();

  try {
    const response = await apiSearchingPictures.getPictures();
    alarm(response);
    console.log(response);
    appendPicturesMarkup(response);
    loadMoreBtn.enable();
  } catch (error) {
    alarmErrorNoFunding();
  }
}

function appendPicturesMarkup(response) {
  refs.gallery.insertAdjacentHTML('beforeend', PictureCard(response.hits));
  const lightbox = new SimpleLightbox('.gallery a');
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function alarm(response) {
  if (response.totalHits === 0) {
    alarmErrorNoFunding();
  } else if (page === 2) {
    alarmInfoTotalHits(response);
  }
  if (page > Math.ceil(response.totalHits / perPage || response.totalHits === perPage)) {
    alarmInfoFinishSearch();
  }
}

function alarmInfoFinishSearch() {
  loadMoreBtn.hide(),
    Notify.info("We're sorry, but you've reached the end of search results.", {
      timeout: 11000,
    });
}

function alarmErrorNoFunding() {
  loadMoreBtn.hide();
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function alarmErrorNoQuerry() {
  loadMoreBtn.hide();
  Notify.failure('Please fill the form');
  return;
}

function alarmInfoTotalHits(response) {
  Notify.success(`Hooray! We found ${response.totalHits} totalHits images.`, {
    timeout: 11000,
  });
}
