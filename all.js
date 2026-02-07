// all.js - Shows all mixes with sort options and filter
setMetaDescription('Browse all ' + tracks.length + ' curated mixes on Mix Repo. Filter by series, sort by latest, earliest, or random.');

// Filter elements
const filterBtn = document.getElementById('filterBtn');
const filterOverlay = document.getElementById('filterOverlay');
const filterGroups = document.getElementById('filterGroups');
const filterApplyBtn = document.getElementById('filterApplyBtn');
const filterClearBtn = document.getElementById('filterClearBtn');

const trackCount = document.getElementById('trackCount');
let selectedGroups = new Set();
let allTracks = [...tracks];
let baseTracks = [...tracks];

function updateCount() {
  if (selectedGroups.size > 0) {
    trackCount.innerHTML = '<span style="color:#ffd166">' + baseTracks.length + '</span> of ' + allTracks.length + ' mixes';
  } else {
    trackCount.textContent = allTracks.length + ' mixes';
  }
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
  updateCount();
  page.applySortAndRender(page.getCurrentSort());
}

const page = createTrackPage(() => baseTracks);

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

// Init — check for ?type= param to pre-filter by section
const urlType = new URLSearchParams(window.location.search).get('type');
if (urlType) {
  const allGroupKeys = [...new Set(tracks.map(t => t.group))];
  allGroupKeys.forEach(g => {
    if (getGroupType(g) === urlType) selectedGroups.add(g);
  });
}
rebuildFilter();
if (selectedGroups.size > 0) {
  applyFilter();
} else {
  updateCount();
  page.applySortAndRender('latest');
}
