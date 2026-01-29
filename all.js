// all.js - Shows all mixes with sort options

let perPage = 8;
let currentPage = 1;
let totalPages = 0;
let currentSort = 'latest';

const grid = document.getElementById('grid');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageNumbersDiv = document.getElementById('pageNumbers');

// Sort buttons
const sortLatestBtn = document.getElementById('sortLatest');
const sortEarliestBtn = document.getElementById('sortEarliest');
const sortRandomBtn = document.getElementById('sortRandom');

// load data dynamically
const script = document.createElement('script');
script.src = 'mix_all.js';
script.onload = init;
document.body.appendChild(script);

let sortedTracks = [];
let baseTracks = [];

// Shuffle helper using crypto-based randomness
function secureRandom() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xFFFFFFFF + 1);
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(secureRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function init() {
  baseTracks = [...tracks];
  applySortAndRender('latest');
  console.log('Total tracks:', baseTracks.length);
}

function applySortAndRender(sortType) {
  currentSort = sortType;
  currentPage = 1;

  // Update active button
  sortLatestBtn.classList.remove('active');
  sortEarliestBtn.classList.remove('active');
  sortRandomBtn.classList.remove('active');

  if (sortType === 'latest') {
    sortedTracks = [...baseTracks].sort((a, b) => Number(b.id) - Number(a.id));
    sortLatestBtn.classList.add('active');
  } else if (sortType === 'earliest') {
    sortedTracks = [...baseTracks].sort((a, b) => Number(a.id) - Number(b.id));
    sortEarliestBtn.classList.add('active');
  } else if (sortType === 'random') {
    sortedTracks = shuffle(baseTracks);
    sortRandomBtn.classList.add('active');
  }

  totalPages = Math.max(1, Math.ceil(sortedTracks.length / perPage));
  renderPage(currentPage);
}

function renderPage(page) {
  grid.innerHTML = '';

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageTracks = sortedTracks.slice(start, end);

  pageTracks.forEach(track => {
    const iframe = document.createElement('iframe');
    iframe.className = 'sc-player';
    iframe.dataset.track = track.id;
    iframe.title = track.title;
    iframe.loading = 'lazy';
    iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.id}&color=%23f60808&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
    grid.appendChild(iframe);
  });

  prevBtn.style.display = (page === 1) ? 'none' : 'block';
  nextBtn.style.display = (page === totalPages) ? 'none' : 'block';

  pageNumbersDiv.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const span = document.createElement('span');
    span.textContent = i;
    span.className = (i === currentPage) ? 'current' : '';
    span.addEventListener('click', () => {
      currentPage = i;
      renderPage(currentPage);
    });
    pageNumbersDiv.appendChild(span);
  }
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Sort button listeners
sortLatestBtn.addEventListener('click', () => applySortAndRender('latest'));
sortEarliestBtn.addEventListener('click', () => applySortAndRender('earliest'));
sortRandomBtn.addEventListener('click', () => applySortAndRender('random'));
