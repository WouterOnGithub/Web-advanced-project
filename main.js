
const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const pokemonList = document.getElementById('pokemon-list');
const favoritesList = document.getElementById('favorites-list');
const profileSection = document.getElementById('pokemon-profile');
const filterType = document.getElementById('filter-type');
const sortSelect = document.getElementById('sort');
const searchInput = document.getElementById('search');
const homeBtn = document.getElementById('home-button');
const favBtn = document.getElementById('favorites-button');

let allPokemon = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentPage = 1;
const perPage = 20;

homeBtn.addEventListener('click', () => location.reload());
favBtn.addEventListener('click', showFavorites);
searchInput.addEventListener('input', renderList);
sortSelect.addEventListener('change', renderList);
filterType.addEventListener('change', renderList);

async function loadPokemon() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const promises = data.results.map(p => fetch(p.url).then(r => r.json()));
  allPokemon = await Promise.all(promises);
  renderTypeOptions();
  renderList();
}

function renderTypeOptions() {
  const types = new Set(allPokemon.flatMap(p => p.types.map(t => t.type.name)));
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filterType.appendChild(opt);
  });
}

function renderList() {
  pokemonList.innerHTML = '';
  let filtered = allPokemon.filter(p =>
    p.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  if (filterType.value !== 'all') {
    filtered = filtered.filter(p =>
      p.types.some(t => t.type.name === filterType.value)
    );
  }
  sortPokemon(filtered);

  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);
  pageItems.forEach(p => pokemonList.appendChild(renderCard(p)));

  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / perPage);
  const nav = document.createElement('div');
  nav.className = 'pagination';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;
    btn.onclick = () => {
      currentPage = i;
      renderList();
    };
    nav.appendChild(btn);
  }
  pokemonList.appendChild(nav);
}

function sortPokemon(list) {
  const val = sortSelect.value;
  if (val === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
  if (val === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
  if (val === 'number-asc') list.sort((a, b) => a.id - b.id);
  if (val === 'number-desc') list.sort((a, b) => b.id - a.id);
}

function renderCard(pokemon) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
    <h4>#${pokemon.id} ${pokemon.name}</h4>
    <div class="heart">${favorites.includes(pokemon.id) ? '❤️' : '🤍'}</div>
  `;
  card.querySelector('img').addEventListener('click', () => showProfile(pokemon));
  card.querySelector('.heart').addEventListener('click', () => toggleFavorite(pokemon.id));
  return card;
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderList();
}

function showFavorites() {
  pokemonList.classList.add('hidden');
  favoritesList.classList.remove('hidden');
  profileSection.classList.add('hidden');
  favoritesList.innerHTML = '';
  const favs = allPokemon.filter(p => favorites.includes(p.id));
  favs.forEach(p => favoritesList.appendChild(renderCard(p)));
}

function showProfile(pokemon) {
  pokemonList.classList.add('hidden');
  favoritesList.classList.add('hidden');
  profileSection.classList.remove('hidden');
  profileSection.innerHTML = `
    <h2>${pokemon.name} (#${pokemon.id})</h2>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" id="sprite" />
    <button id="toggle-shiny">⭐</button>
    <button id="to-favorites">❤</button>
    <button id="to-list">⬅️</button>
    <button id="next">Next ➡️</button>
  `;
  document.getElementById('to-list').onclick = () => location.reload();
  document.getElementById('to-favorites').onclick = showFavorites;
  document.getElementById('toggle-shiny').onclick = () => {
    const img = document.getElementById('sprite');
    img.src =
      img.src === pokemon.sprites.front_default
        ? pokemon.sprites.front_shiny
        : pokemon.sprites.front_default;
  };
  document.getElementById('next').onclick = () => {
    const next = allPokemon.find(p => p.id === pokemon.id + 1);
    if (next) showProfile(next);
  };
}

loadPokemon();


/**
 * Changes to make:
 * Make vertical list 3 pokemon per row instead of one, and make the pokemon take up more space
 * Add forest.png as background for each pokemon
 * Add pokeball-strip.png to left and right side
 * Make filter and sort option take less space so that pokeball-strip.png can fit
 * Instead of favorite list, make your favorite pokemon a filter option (therefore, delete the heart at the top right)
 * Extend the list of pokemon so all pokemon from 1 to 1025 fit on the website
 * Make the house icon more obvious at the top left
 * Add seperate page for the pokemon profile
 *  */ 

