const grid = document.getElementById('grid');

// Filter elements
const filterBtn = document.getElementById('filterBtn');
const filterOverlay = document.getElementById('filterOverlay');
const filterGroups = document.getElementById('filterGroups');
const filterApplyBtn = document.getElementById('filterApplyBtn');
const filterClearBtn = document.getElementById('filterClearBtn');

let selectedGroups = new Set();
let filteredTracks = tracks;

// Group name mapping for display
const groupNames = {
  'AF': 'Analogical Force', 'Archaic': 'Archaic', 'Bassiani': 'Bassiani',
  'DeepBreakfast': 'Deep Breakfast', 'Dekmantel': 'Dekmantel',
  'DSH': 'Deep Space Helsinki', 'DSS': 'Deep Space Series',
  'FMB': 'Feel My Bicep', 'Hate': 'Hate', 'IA': 'Inverted Audio',
  'Ilian': 'Ilian Tape', 'Isolated': 'Isolated', 'MDC': 'Melbourne Deepcast',
  'Memoir': 'Memoir', 'Mesh': 'Mesh', 'Monument': 'Monument',
  'MonumentLive': 'Monument Live', 'MonumentRecordings': 'Monument Recordings',
  'MonumentWaves': 'Monument Waves', 'Nousklaer': "Nous'klaer",
  'Oslated': 'Oslated', 'Pure': 'Pure', 'RYC': 'Reclaim Your City',
  'RA': 'Resident Advisor', 'RALive': 'Resident Advisor Live',
  'Rural': 'Rural', 'RuralFestival': 'Rural Festival', 'Slam': 'Slam Radio',
  'RoelFuncken': 'Roel Funcken', 'Unclassified': 'Unclassified'
};

// Better random number generator using crypto API
function secureRandom() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xFFFFFFFF + 1);
}

// Shuffle helper using crypto-based randomness
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(secureRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pick random tracks weighted by group size
function getRandomTracksWeighted(tracksArray, count = 8) {
  const shuffled = shuffle([...tracksArray]);

  // To avoid too many from the same group, limit to max 2 per group
  const result = [];
  const groupCounts = {};
  const maxPerGroup = 2;

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
  const randomTracks = getRandomTracksWeighted(filteredTracks, 8);

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

// Filter popup
function buildFilterPopup() {
  const groups = [...new Set(tracks.map(t => t.group))].sort((a, b) => {
    const nameA = (groupNames[a] || a).toLowerCase();
    const nameB = (groupNames[b] || b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  filterGroups.innerHTML = '';
  groups.forEach(group => {
    const count = tracks.filter(t => t.group === group).length;
    const btn = document.createElement('button');
    btn.className = 'filter-group-btn';
    btn.textContent = `${groupNames[group] || group} (${count})`;
    btn.dataset.group = group;
    if (selectedGroups.has(group)) btn.classList.add('active');
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      if (selectedGroups.has(group)) {
        selectedGroups.delete(group);
      } else {
        selectedGroups.add(group);
      }
    });
    filterGroups.appendChild(btn);
  });
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
  buildFilterPopup();
  filterOverlay.classList.add('show');
});

filterOverlay.addEventListener('click', (e) => {
  if (e.target === filterOverlay) filterOverlay.classList.remove('show');
});

filterApplyBtn.addEventListener('click', applyFilter);

filterClearBtn.addEventListener('click', () => {
  selectedGroups.clear();
  buildFilterPopup();
});

// Initial render
renderRandomTracks();

// Shuffle button
document.getElementById('shuffleBtn').addEventListener('click', renderRandomTracks);
