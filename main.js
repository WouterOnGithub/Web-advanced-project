const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
const pokemonList = document.getElementById('pokemon-list');
const profileSection = document.getElementById('pokemon-profile');
const filterType = document.getElementById('filter-type');
const sortSelect = document.getElementById('sort');
const searchInput = document.getElementById('search');
const homeBtn = document.getElementById('home-button');
const showFavoritesCheckbox = document.getElementById('show-favorites');

let allPokemon = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentPage = 1;
const perPage = 21; 

homeBtn.addEventListener('click', () => {
  profileSection.classList.add('hidden');
  pokemonList.classList.remove('hidden');
  renderList();
});

searchInput.addEventListener('input', () => {
  currentPage = 1;
  renderList();
});

sortSelect.addEventListener('change', () => {
  currentPage = 1;
  renderList();
});

filterType.addEventListener('change', () => {
  currentPage = 1;
  renderList();
});

showFavoritesCheckbox.addEventListener('change', () => {
  currentPage = 1;
  renderList();
});

async function loadPokemon() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    //* In batches to prevent timeout
    const batches = [];
    for (let i = 0; i < data.results.length; i += 50) {
      batches.push(data.results.slice(i, i + 50));
    }
    
    for (const batch of batches) {
      const promises = batch.map(p => fetch(p.url).then(r => r.json()));
      const pokemonBatch = await Promise.all(promises);
      allPokemon = [...allPokemon, ...pokemonBatch];
      
      if (allPokemon.length <= 151) {
        renderTypeOptions();
        renderList();
      }
    }
    
    renderTypeOptions();
    renderList();
  } catch (error) {
    console.error('Error loading Pokémon data:', error);
  }
}

function renderTypeOptions() {
  const types = new Set(allPokemon.flatMap(p => p.types.map(t => t.type.name)));
  filterType.innerHTML = '<option value="all">Filter on...</option>';
  
  Array.from(types).sort().forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
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
  
  if (showFavoritesCheckbox.checked) {
    filtered = filtered.filter(p => favorites.includes(p.id));
  }
  
  sortPokemon(filtered);

  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);
  
  const pokemonGrid = document.createElement('div');
  pokemonGrid.className = 'pokemon-grid';
  pageItems.forEach(p => pokemonGrid.appendChild(renderCard(p)));
  pokemonList.appendChild(pokemonGrid);

  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / perPage);
  const nav = document.createElement('div');
  nav.className = 'pagination';
  
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '«';
    prevBtn.onclick = () => {
      currentPage--;
      renderList();
    };
    nav.appendChild(prevBtn);
  }
  
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  if (startPage > 1) {
    const firstBtn = document.createElement('button');
    firstBtn.textContent = '1';
    firstBtn.onclick = () => {
      currentPage = 1;
      renderList();
    };
    nav.appendChild(firstBtn);
    
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      ellipsis.className = 'ellipsis';
      nav.appendChild(ellipsis);
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.className = 'active';
    btn.onclick = () => {
      currentPage = i;
      renderList();
    };
    nav.appendChild(btn);
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      ellipsis.className = 'ellipsis';
      nav.appendChild(ellipsis);
    }
    
    const lastBtn = document.createElement('button');
    lastBtn.textContent = totalPages;
    lastBtn.onclick = () => {
      currentPage = totalPages;
      renderList();
    };
    nav.appendChild(lastBtn);
  }
  
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '»';
    nextBtn.onclick = () => {
      currentPage++;
      renderList();
    };
    nav.appendChild(nextBtn);
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

function formatPokemonNumber(id) {
  return '#' + id.toString().padStart(4, '0');
}

function renderCard(pokemon) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  
  const isFavorite = favorites.includes(pokemon.id);
  
  card.innerHTML = `
    <div class="card-content">
      <div class="pokemon-image">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      </div>
      <div class="pokemon-info">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
      </div>
      <div class="heart ${isFavorite ? 'favorite' : ''}" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
        ${isFavorite ? '❤️' : '🤍'}
      </div>
    </div>
  `;
  
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.heart')) {
      showProfile(pokemon);
    }
  });
  
  card.querySelector('.heart').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  });
  
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

async function showProfile(pokemon) {
  pokemonList.classList.add('hidden');
  profileSection.classList.remove('hidden');

  // Get description from species endpoint
  let description = 'No description available.';
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`);
    const speciesData = await res.json();
    const flavor = speciesData.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    if (flavor) {
      description = flavor.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    }
  } catch (error) {
    console.error('Failed to fetch Pokémon description:', error);
  }

  const types = pokemon.types.map(t => {
    const typeName = t.type.name;
    return `<div class="type-badge ${typeName}">${typeName.charAt(0).toUpperCase() + typeName.slice(1)}</div>`;
  }).join('');

  const nextPokemon = allPokemon.find(p => p.id === pokemon.id + 1);
  const nextPokemonName = nextPokemon ? nextPokemon.name : '';
  const nextPokemonSprite = nextPokemon ? nextPokemon.sprites.front_default : '';

  const stats = pokemon.stats.map(s => {
    const statName = s.stat.name.replace('-', ' ');
    return `
      <div class="stat">
        <span class="stat-name">${statName.charAt(0).toUpperCase() + statName.slice(1)}:</span>
        <span class="stat-value">${s.base_stat}</span>
      </div>
    `;
  }).join('');

  profileSection.innerHTML = `
    <div class="profile-header">
      <button id="back-button" class="back-button">⬅️ Back</button>
      <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} ${formatPokemonNumber(pokemon.id)}</h2>
      <div class="favorite-toggle">
        <span id="favorite-btn" class="${favorites.includes(pokemon.id) ? 'favorite' : ''}">
          ${favorites.includes(pokemon.id) ? '❤️' : '🤍'}
        </span>
      </div>
    </div>
    
    <div class="profile-content">
      <div class="profile-main">
        <div class="pokemon-image-large">
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" id="sprite" />
          <button id="toggle-shiny" class="toggle-shiny">
            <span class="text">⭐ Show Shiny</span>
          </button>
        </div>
        
        <div class="pokemon-details">
          <div class="pokemon-types">
            ${types}
          </div>
          
          <div class="pokemon-description">
            <h3>Description</h3>
            <p>${description}</p>
          </div>

          <div class="pokemon-measurements">
            <div class="measurement">
              <span class="label">Height:</span>
              <span class="value">${pokemon.height / 10}m</span>
            </div>
            <div class="measurement">
              <span class="label">Weight:</span>
              <span class="value">${pokemon.weight / 10}kg</span>
            </div>
          </div>
          
          <div class="pokemon-stats">
            ${stats}
          </div>
        </div>
      </div>
      
      ${nextPokemon ? `
        <div class="next-pokemon">
          <h3>Next Pokémon:</h3>
          <div class="next-pokemon-preview" data-id="${nextPokemon.id}">
            <span>${nextPokemonName.charAt(0).toUpperCase() + nextPokemonName.slice(1)}</span>
            <img src="${nextPokemonSprite}" alt="${nextPokemonName}" />
          </div>
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('back-button').addEventListener('click', () => {
    profileSection.classList.add('hidden');
    pokemonList.classList.remove('hidden');
  });

  const toggleShinyBtn = document.getElementById('toggle-shiny');
  toggleShinyBtn.onclick = function() {
    const img = document.getElementById('sprite');
    const isDefault = img.src === pokemon.sprites.front_default;

    if (isDefault && pokemon.sprites.front_shiny) {
      img.src = pokemon.sprites.front_shiny;
    } else {
      img.src = pokemon.sprites.front_default;
    }
  };

  document.getElementById('favorite-btn').addEventListener('click', () => {
    toggleFavorite(pokemon.id);
    const btn = document.getElementById('favorite-btn');
    if (favorites.includes(pokemon.id)) {
      btn.textContent = '❤️';
      btn.classList.add('favorite');
    } else {
      btn.textContent = '🤍';
      btn.classList.remove('favorite');
    }
  });

  if (nextPokemon) {
    document.querySelector('.next-pokemon-preview').addEventListener('click', () => {
      showProfile(nextPokemon);
    });
  }
}

loadPokemon();

/**
 * To do list:
* Make readme file
* Clean up code
*/ 

