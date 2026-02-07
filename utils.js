// utils.js - Shared utilities for Mix Repo

// Set meta description dynamically
function setMetaDescription(content) {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Group name mapping for display
const groupNames = {
  'AF': 'Analogical Force', 'Archaic': 'Archaic', 'ArtBeiTon': 'Art Bei Ton',
  'Bassiani': 'Bassiani', 'Camp': 'Campfire Stories',
  'DeepBreakfast': 'Deep Breakfast', 'Dekmantel': 'Dekmantel',
  'DiscWom': 'Disc Woman', 'Draaimolen': 'Draaimolen',
  'DSH': 'Deep Space Helsinki', 'DSS': 'Deep Space Series',
  'EE': 'Electronic Explorations', 'FMB': 'Feel My Bicep', 'Hate': 'Hate',
  'IA': 'Inverted Audio', 'Ilian': 'Ilian Tape', 'Isolated': 'Isolated',
  'LIES': 'L.I.E.S', 'LOT': 'The Lot Radio',
  'MDC': 'Melbourne Deepcast', 'Memoir': 'Memoir', 'Mesh': 'Mesh', 'MissTape': 'Missing Tapes',
  'Modcast': 'Modcast', 'Monument': 'Monument', 'MonumentLive': 'Monument Live',
  'MonumentRecordings': 'Monument Recordings', 'MonumentWaves': 'Monument Waves',
  'Nousklaer': "Nous'klaer", 'Oslated': 'Oslated', 'Phonons': 'Phonons',
  'Phonica': 'Phonica', 'PhonicaFRDFAM': 'Phonica Friends and Family',
  'PhonicaOff': 'Phonica Off The Record',
  'Pure': 'Pure', 'RDC': 'Rainbow Disco Club', 'Rinse': 'Rinse FM', 'RYC': 'Reclaim Your City', 'Sensu': 'Sensu',
  'RA': 'Resident Advisor', 'RALive': 'Resident Advisor Live', 'Rural': 'Rural',
  'RuralFestival': 'Rural Festival', 'Slam': 'Slam Radio',
  'Smoke': 'Smoke Machine', 'SoundsNowhere': 'Sounds From Nowhere',
  'SoundSculpters': 'Sound Sculpters', 'Uncover': 'Uncover',
  'Undulate': 'Undulate', 'Zenarri': 'Zenarri',
  'NTS': 'NTS', 'Unclassified': 'Unclassified'
};

// Group type mapping (unlisted groups default to 'mix')
const groupTypes = {
  'NTS': 'radio',
  'LOT': 'radio',
  'Rinse': 'radio',
  'Draaimolen': 'live',
  'MonumentLive': 'live',
  'MonumentRecordings': 'live',
  'RALive': 'live',
  'RuralFestival': 'live'
};

function getGroupType(group) {
  return groupTypes[group] || 'mix';
}

// Crypto-based random number generator
function secureRandom() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xFFFFFFFF + 1);
}

// Fisher-Yates shuffle using crypto randomness
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

// Build filter popup with group buttons by section
function buildFilterPopup(tracks, selectedGroups, filterGroups, onRebuild) {
  const allGroups = [...new Set(tracks.map(t => t.group))].sort((a, b) => {
    const nameA = (groupNames[a] || a).toLowerCase();
    const nameB = (groupNames[b] || b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const mixGroups = allGroups.filter(g => getGroupType(g) === 'mix');
  const radioGroups = allGroups.filter(g => getGroupType(g) === 'radio');
  const liveGroups = allGroups.filter(g => getGroupType(g) === 'live');

  filterGroups.innerHTML = '';

  // Build each section
  const sections = [
    { title: 'Mix Series', groups: mixGroups },
    { title: 'Live / Festival', groups: liveGroups },
    { title: 'Radio', groups: radioGroups }
  ];

  sections.forEach(({ title, groups }) => {
    if (groups.length === 0) return;

    const sectionCount = groups.reduce((sum, g) => sum + tracks.filter(t => t.group === g).length, 0);
    const label = document.createElement('h4');
    label.className = 'filter-section-title';
    label.textContent = `${title} (${sectionCount})`;
    label.addEventListener('click', () => {
      const allSelected = groups.every(g => selectedGroups.has(g));
      groups.forEach(g => allSelected ? selectedGroups.delete(g) : selectedGroups.add(g));
      onRebuild();
    });
    filterGroups.appendChild(label);

    const container = document.createElement('div');
    container.className = 'filter-section-groups';
    groups.forEach(group => {
      container.appendChild(createGroupBtn(tracks, group, selectedGroups));
    });
    filterGroups.appendChild(container);
  });

  // Add Select All and Random 5 to filter-actions (before Clear/Apply)
  const filterActions = document.querySelector('.filter-actions');

  // Remove existing Select All / Random 5 if present (from previous rebuild)
  filterActions.querySelectorAll('.filter-select-all, .filter-random-5').forEach(el => el.remove());

  // Select All button
  const selectAllBtn = document.createElement('button');
  selectAllBtn.className = 'filter-action-btn filter-select-all';
  const allSelected = allGroups.every(g => selectedGroups.has(g));
  selectAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';
  if (allSelected) selectAllBtn.classList.add('active');
  selectAllBtn.addEventListener('click', () => {
    if (allGroups.every(g => selectedGroups.has(g))) {
      selectedGroups.clear();
    } else {
      allGroups.forEach(g => selectedGroups.add(g));
    }
    onRebuild();
  });
  filterActions.insertBefore(selectAllBtn, filterActions.querySelector('.filter-clear'));

  // Random 5 button
  const random5Btn = document.createElement('button');
  random5Btn.className = 'filter-action-btn filter-random-5';
  random5Btn.textContent = 'Random 5';
  random5Btn.addEventListener('click', () => {
    selectedGroups.clear();
    const shuffled = shuffle(allGroups);
    shuffled.slice(0, 5).forEach(g => selectedGroups.add(g));
    onRebuild();
  });
  filterActions.insertBefore(random5Btn, filterActions.firstChild);
}

// Create a SoundCloud iframe for a track
function createEmbed(track) {
  const iframe = document.createElement('iframe');
  iframe.className = 'sc-player';
  iframe.dataset.track = track.id;
  iframe.title = track.title;
  iframe.loading = 'lazy';
  iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.id}&color=%23f60808&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
  return iframe;
}

// Create a paginated, sortable track page controller
function createTrackPage(getBaseTracks) {
  const perPage = 8;
  let currentPage = 1;
  let totalPages = 0;
  let currentSort = 'latest';
  let sortedTracks = [];

  const grid = document.getElementById('grid');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const pageNumbersDiv = document.getElementById('pageNumbers');

  const sortLatestBtn = document.getElementById('sortLatest');
  const sortEarliestBtn = document.getElementById('sortEarliest');
  const sortRandomBtn = document.getElementById('sortRandom');

  function applySortAndRender(sortType) {
    currentSort = sortType;
    currentPage = 1;
    const baseTracks = getBaseTracks();

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
    const pageTracks = sortedTracks.slice(start, start + perPage);

    pageTracks.forEach(track => {
      grid.appendChild(createEmbed(track));
    });

    prevBtn.style.display = (page === 1) ? 'none' : 'block';
    nextBtn.style.display = (page === totalPages) ? 'none' : 'block';

    pageNumbersDiv.innerHTML = '';

    if (currentPage > 1) {
      const prev = document.createElement('span');
      prev.textContent = '\u2039';
      prev.className = 'page-arrow';
      prev.addEventListener('click', () => { currentPage--; renderPage(currentPage); });
      pageNumbersDiv.appendChild(prev);
    }

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

    if (currentPage < totalPages) {
      const next = document.createElement('span');
      next.textContent = '\u203A';
      next.className = 'page-arrow';
      next.addEventListener('click', () => { currentPage++; renderPage(currentPage); });
      pageNumbersDiv.appendChild(next);
    }
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderPage(currentPage); }
  });
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; renderPage(currentPage); }
  });

  sortLatestBtn.addEventListener('click', () => applySortAndRender('latest'));
  sortEarliestBtn.addEventListener('click', () => applySortAndRender('earliest'));
  sortRandomBtn.addEventListener('click', () => applySortAndRender('random'));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Don't navigate if filter popup is open
    if (document.querySelector('.filter-overlay.show')) return;
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
    }
  });

  return { applySortAndRender, getCurrentSort: () => currentSort };
}

// Close filter popup on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.querySelector('.filter-overlay.show');
    if (overlay) overlay.classList.remove('show');
  }
});

// Create a single group button
function createGroupBtn(tracks, group, selectedGroups) {
  const count = tracks.filter(t => t.group === group).length;
  const btn = document.createElement('button');
  btn.className = 'filter-group-btn';
  if (group === 'Unclassified') btn.classList.add('unclassified');
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
  return btn;
}
