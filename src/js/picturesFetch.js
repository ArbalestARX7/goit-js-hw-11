import axios from 'axios';
import notiflix, { Notify } from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
let page = 1;

export async function picturesFetch(query) {
  const params = new URLSearchParams({
    key: '34967453-3ca42dd1f1965c53ca3c21f87',
    q: query,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
  });

  const response = await axios.get(
    `${BASE_URL}?${params}&per_page=40&page=${page}`
  );

  console.log(page);

  page += 1;

  return response.data;
}

export function pageReset() {
  page = 1;
}
