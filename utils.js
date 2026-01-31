// utils.js - Shared utilities for MixRepo

// Group name mapping for display
const groupNames = {
  'AF': 'Analogical Force', 'Archaic': 'Archaic', 'ArtBeiTon': 'Art Bei Ton',
  'Bassiani': 'Bassiani', 'DeepBreakfast': 'Deep Breakfast', 'Dekmantel': 'Dekmantel',
  'DSH': 'Deep Space Helsinki', 'DSS': 'Deep Space Series',
  'EE': 'Electronic Explorations', 'FMB': 'Feel My Bicep', 'Hate': 'Hate',
  'IA': 'Inverted Audio', 'Ilian': 'Ilian Tape', 'Isolated': 'Isolated',
  'MDC': 'Melbourne Deepcast', 'Memoir': 'Memoir', 'Mesh': 'Mesh',
  'Monument': 'Monument', 'MonumentLive': 'Monument Live',
  'MonumentRecordings': 'Monument Recordings', 'MonumentWaves': 'Monument Waves',
  'Nousklaer': "Nous'klaer", 'Oslated': 'Oslated', 'Phonons': 'Phonons',
  'Pure': 'Pure', 'RYC': 'Reclaim Your City', 'RA': 'Resident Advisor',
  'RALive': 'Resident Advisor Live', 'Rural': 'Rural',
  'RuralFestival': 'Rural Festival', 'Slam': 'Slam Radio',
  'SoundSculpters': 'Sound Sculpters', 'Undulate': 'Undulate',
  'RoelFuncken': 'Roel Funcken', 'Unclassified': 'Unclassified'
};

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

// Build filter popup with group buttons
function buildFilterPopup(tracks, selectedGroups, filterGroups, onRebuild) {
  const groups = [...new Set(tracks.map(t => t.group))].sort((a, b) => {
    const nameA = (groupNames[a] || a).toLowerCase();
    const nameB = (groupNames[b] || b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  filterGroups.innerHTML = '';

  // Select All button
  const selectAllBtn = document.createElement('button');
  selectAllBtn.className = 'filter-group-btn filter-select-all';
  const allSelected = groups.every(g => selectedGroups.has(g));
  selectAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';
  if (allSelected) selectAllBtn.classList.add('active');
  selectAllBtn.addEventListener('click', () => {
    if (groups.every(g => selectedGroups.has(g))) {
      selectedGroups.clear();
    } else {
      groups.forEach(g => selectedGroups.add(g));
    }
    onRebuild();
  });
  filterGroups.appendChild(selectAllBtn);

  groups.forEach(group => {
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
    filterGroups.appendChild(btn);
  });
}
