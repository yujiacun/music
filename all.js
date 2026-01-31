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

// Filter elements
const filterBtn = document.getElementById('filterBtn');
const filterOverlay = document.getElementById('filterOverlay');
const filterGroups = document.getElementById('filterGroups');
const filterApplyBtn = document.getElementById('filterApplyBtn');
const filterClearBtn = document.getElementById('filterClearBtn');

let selectedGroups = new Set();

// load data dynamically
const script = document.createElement('script');
script.src = 'mix_all.js';
script.onload = init;
document.body.appendChild(script);

let sortedTracks = [];
let baseTracks = [];
let allTracks = [];

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

function rebuildFilter() {
  buildFilterPopup(tracks, selectedGroups, filterGroups, rebuildFilter);
}

function applyFilter() {
  if (selectedGroups.size === 0) {
    baseTracks = [...allTracks];
  } else {
    baseTracks = allTracks.filter(t => selectedGroups.has(t.group));
  }
  filterBtn.textContent = selectedGroups.size > 0 ? `Filter (${selectedGroups.size})` : 'Filter';
  filterOverlay.classList.remove('show');
  applySortAndRender(currentSort);
}

function init() {
  allTracks = [...tracks];
  baseTracks = [...tracks];
  rebuildFilter();
  applySortAndRender('latest');
  console.log('Total tracks:', baseTracks.length);
}

// Filter event listeners
filterBtn.addEventListener('click', () => {
  rebuildFilter();
  filterOverlay.classList.add('show');
});

filterOverlay.addEventListener('click', (e) => {
  if (e.target === filterOverlay) filterOverlay.classList.remove('show');
});

filterApplyBtn.addEventListener('click', applyFilter);

filterClearBtn.addEventListener('click', () => {
  selectedGroups.clear();
  rebuildFilter();
});

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
