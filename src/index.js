import { pageReset, picturesFetch } from './js/picturesFetch';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const inputSearch = document.querySelector('.search-form input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let totalHits = null;

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSubmit(evt) {
  evt.preventDefault();
  query = inputSearch.value.trim();

  loadMoreBtn.classList.add('is-hidden');

  markupReset();
  pageReset();

  if (query === '') {
    return Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  const pictures = await picturesFetch(query);
  totalHits = pictures.totalHits;

  if (totalHits === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  Notify.info(`Hooray! We found ${totalHits} images.`);

  pictureMarkup(pictures);
  lightbox.refresh();

  loadMoreBtn.classList.remove('is-hidden');
}

async function onLoadMore() {
  const newPictures = await picturesFetch(query);
  totalHits = newPictures.hits.length;

  pictureMarkup(newPictures);
  lightbox.refresh();
  smoothScrol();

  if (totalHits < 8) {
    loadMoreBtn.classList.add('is-hidden');
    return Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function pictureMarkup(pictures) {
  const markup = pictures.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a class="gallery-item" href="${largeImageURL}">
  <img class="gallery-image" src="${webformatURL}" alt="${tags} " loading="lazy" /> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span class="img_stats">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span class="img_stats">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span class="img_stats">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span class="img_stats">${downloads}</span>
    </p>
  </div>
</div>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function markupReset() {
  gallery.innerHTML = '';
}

function smoothScrol() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.5,
    behavior: 'smooth',
  });
}
