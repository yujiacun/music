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

const grid = document.getElementById('grid');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageNumbersDiv = document.getElementById('pageNumbers');

// load data dynamically
const script = document.createElement('script');
script.src = 'mix_all.js';
script.onload = init;
document.body.appendChild(script);

let filteredTracks = [];

function init() {
  filteredTracks = tracks.filter(t => t.group === group);
  totalPages = Math.max(1, Math.ceil(filteredTracks.length / perPage));
  renderPage(currentPage);
  console.log('Group:', group);
  console.log('Tracks found:', filteredTracks.length);
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


