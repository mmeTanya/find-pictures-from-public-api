import PictureCard from './example/picture_card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiSearchingPictures from './js/fetchPictures';
import LoadMoreBtn from './js/loadMore';
import './sass/main.css';
import { page, perPage } from './js/fetchPictures';

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
loadMoreBtn.refs.button.addEventListener('click', fetchPictures);

function onSearch(e) {
  e.preventDefault();

  apiSearchingPictures.query = e.currentTarget.searchQuery.value;

  apiSearchingPictures.resetPage();
  clearGallery();
  fetchPictures();
}

function fetchPictures() {
  if (apiSearchingPictures.query === '') {
    alarmErrorNoQuerry();
    return;
  }

  loadMoreBtn.show();
  loadMoreBtn.disable();

  apiSearchingPictures.fetchPictures().then(pictures => {
    if (pictures.data.totalHits === 0) {
      alarmErrorNoFunding();
    } else if (page === 2) {
       Notify.success(`Hooray! We found ${pictures.data.totalHits} totalHits images.`, {
         timeout: 11000,
       });
    } else if (page > Math.ceil(pictures.data.totalHits / perPage)) {
      alarmInfoFinishSearch();
    }

    console.log(pictures.data);
    appendPicturesMarkup(pictures);
    loadMoreBtn.enable();
  });
}

function appendPicturesMarkup(pictures) {
  refs.gallery.insertAdjacentHTML('beforeend', PictureCard(pictures.data.hits));
  const lightbox = new SimpleLightbox('.gallery a');
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function alarmInfoFinishSearch() {
  loadMoreBtn.hide(),
    Notify.success("We're sorry, but you've reached the end of search results.", {
      timeout: 11000,
    });
}

function alarmErrorNoFunding() {
  loadMoreBtn.hide();
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function alarmErrorNoQuerry() {
  if (apiSearchingPictures.query === '') {
    loadMoreBtn.hide();
    Notify.failure('Please fill the form');
    return;
  }
}
