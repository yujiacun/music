// random.js - Random mix selection with filter support

const grid = document.getElementById('grid');

// Filter elements
const filterBtn = document.getElementById('filterBtn');
const filterOverlay = document.getElementById('filterOverlay');
const filterGroups = document.getElementById('filterGroups');
const filterApplyBtn = document.getElementById('filterApplyBtn');
const filterClearBtn = document.getElementById('filterClearBtn');

let selectedGroups = new Set();
let filteredTracks = tracks;

// Pick random tracks with per-group cap based on number of selected groups
function getRandomTracks(tracksArray, count = 8) {
  const shuffled = shuffle([...tracksArray]);
  const numGroups = selectedGroups.size;

  // Scale per-group cap: 1 group = 8, 2 = 4, 3 = 3, 4+ or unfiltered = 2
  let maxPerGroup;
  if (numGroups === 1) maxPerGroup = 8;
  else if (numGroups === 2) maxPerGroup = 4;
  else if (numGroups === 3) maxPerGroup = 3;
  else maxPerGroup = 2;

  const result = [];
  const groupCounts = {};

  for (const track of shuffled) {
    if (result.length >= count) break;

    const group = track.group;
    groupCounts[group] = (groupCounts[group] || 0);

    if (groupCounts[group] < maxPerGroup) {
      result.push(track);
      groupCounts[group]++;
    }
  }

  return shuffle(result);
}

function renderRandomTracks() {
  grid.innerHTML = '';
  const randomTracks = getRandomTracks(filteredTracks, 8);

  randomTracks.forEach(track => {
    const iframe = document.createElement('iframe');
    iframe.className = 'sc-player';
    iframe.dataset.track = track.id;
    iframe.title = track.title;
    iframe.loading = 'lazy';
    iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.id}&color=%23f60808&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
    grid.appendChild(iframe);
  });
}

function rebuildFilter() {
  buildFilterPopup(tracks, selectedGroups, filterGroups, rebuildFilter);
}

function applyFilter() {
  if (selectedGroups.size > 0) {
    filteredTracks = tracks.filter(t => selectedGroups.has(t.group));
  } else {
    filteredTracks = [...tracks];
  }
  filterBtn.textContent = selectedGroups.size > 0 ? `Filter (${selectedGroups.size})` : 'Filter';
  filterOverlay.classList.remove('show');
  renderRandomTracks();
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

// Initial render
renderRandomTracks();

// Shuffle button
document.getElementById('shuffleBtn').addEventListener('click', renderRandomTracks);
