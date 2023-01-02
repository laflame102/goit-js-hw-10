import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
}
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
    evt.preventDefault();
    
    const value = evt.target.value.trim();

    refs.info.innerHTML = '';
    refs.list.innerHTML = '';

    if (!evt.target.value) {
        return;
    } else {
        fetchCountries(value)
            .then(data => {
                if (data.length >= 10) {
                    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
                }
                else if (!data.length) {
                    Notiflix.Notify.failure("Oops, there is no country with that name");
                }
                else if (data.length >= 2 && data.length <= 10) {
                    createCountryList(data)
                }
                else if (data.length === 1) {
                    createCountryInfo(data);
                }
        })
        .catch(error => Notiflix.Notify.failure(`${error}`))
    }
}

function createCountryList(countries){
    const markup = countries.map(({ name: { official }, flags: { svg } }) => {
        return `<li><img width="30px" src="${svg}" alt=""><span>${official}</span></li>`
    }).join('')
    refs.list.insertAdjacentHTML('beforeend', markup);
 }


function createCountryInfo(countries){
    const markup = countries.map(({ name: { official }, capital, population, flags: { svg }, languages }) => {
        const allLanguages = Object.values(languages);
        return `<div>
      <img class="country__img" width="40px" src="${svg}" alt="${official}">
      <h2 class="country__heading">${official}</h2>
      <ul class="country__menu">
        <li class="country__item">Capital: ${capital}</li>
        <li class="country__item">Population: ${population}</li>
        <li class="country__item">Languages: ${allLanguages}</li>
      </ul>
    </div>`
    }).join('')
    refs.info.insertAdjacentHTML('beforeend', markup);
}