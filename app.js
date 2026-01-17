// app.js
const perPage = 9;
let currentPage = 1;
const totalPages = Math.ceil(tracks.length / perPage);

const grid = document.getElementById('grid');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageNumbersDiv = document.getElementById('pageNumbers');

function renderPage(page) {
  grid.innerHTML = '';

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageTracks = tracks.slice(start, end);

  pageTracks.forEach(track => {
    const iframe = document.createElement('iframe');
    iframe.className = 'sc-player';
    iframe.dataset.track = track.id;
    iframe.title = track.title;
    iframe.loading = 'lazy';
    iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.id}&color=%23f60808&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true`;
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
  if (currentPage > 1) { currentPage--; renderPage(currentPage); }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) { currentPage++; renderPage(currentPage); }
});

// Initial render
renderPage(currentPage);

