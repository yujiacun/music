// app.js
const params = new URLSearchParams(window.location.search);
const group = params.get('group');

if (!group) {
  alert('No group provided');
}

// shared state
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

let filteredTracks = [];
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

// Returns page numbers with ellipsis truncation
function getVisiblePages(current, total) {
  if (total <= 7) {
    return Array.from({length: total}, (_, i) => i + 1);
  }
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...');
    }
    result.push(sorted[i]);
  }
  return result;
}

function init() {
  baseTracks = tracks.filter(t => t.group === group);
  applySortAndRender('latest');
  console.log('Group:', group);
  console.log('Tracks found:', baseTracks.length);
}

function applySortAndRender(sortType) {
  currentSort = sortType;
  currentPage = 1;

  // Update active button
  sortLatestBtn.classList.remove('active');
  sortEarliestBtn.classList.remove('active');
  sortRandomBtn.classList.remove('active');

  if (sortType === 'latest') {
    filteredTracks = [...baseTracks].sort((a, b) => Number(b.id) - Number(a.id));
    sortLatestBtn.classList.add('active');
  } else if (sortType === 'earliest') {
    filteredTracks = [...baseTracks].sort((a, b) => Number(a.id) - Number(b.id));
    sortEarliestBtn.classList.add('active');
  } else if (sortType === 'random') {
    filteredTracks = shuffle(baseTracks);
    sortRandomBtn.classList.add('active');
  }

  totalPages = Math.max(1, Math.ceil(filteredTracks.length / perPage));
  renderPage(currentPage);
}

function renderPage(page) {
  grid.innerHTML = '';

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageTracks = filteredTracks.slice(start, end);

  pageTracks.forEach(track => {
    const iframe = document.createElement('iframe');
    iframe.className = 'sc-player';
    iframe.dataset.track = track.id;
    iframe.title = track.title;
    iframe.loading = 'lazy';
    iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.id}&color=%23ca0202&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    grid.appendChild(iframe);
  });

  prevBtn.style.display = (page === 1) ? 'none' : 'block';
  nextBtn.style.display = (page === totalPages) ? 'none' : 'block';

  pageNumbersDiv.innerHTML = '';
  const pages = getVisiblePages(currentPage, totalPages);
  pages.forEach(p => {
    const span = document.createElement('span');
    if (p === '...') {
      span.textContent = '...';
      span.className = 'ellipsis';
    } else {
      span.textContent = p;
      span.className = (p === currentPage) ? 'current' : '';
      span.addEventListener('click', () => {
        currentPage = p;
        renderPage(currentPage);
      });
    }
    pageNumbersDiv.appendChild(span);
  });
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
