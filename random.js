const grid = document.getElementById('grid');

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

// Pick 12 random tracks with max 2 per group
function getRandomTracksLimited(tracksArray, count = 8, maxPerGroup = 1) {
  // Group tracks by their "group" property
  const groups = {};
  tracksArray.forEach(track => {
    if (!groups[track.group]) groups[track.group] = [];
    groups[track.group].push(track);
  });

  const result = [];

  // Pick up to maxPerGroup from each group randomly
  for (const groupTracks of Object.values(groups)) {
    const shuffledGroup = shuffle([...groupTracks]);
    const picks = shuffledGroup.slice(0, maxPerGroup);
    result.push(...picks);
  }

  // Shuffle final list and trim to requested count
  return shuffle(result).slice(0, count);
}

function renderRandomTracks() {
  grid.innerHTML = '';
  const randomTracks = getRandomTracksLimited(tracks, 8, 1);

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

// Initial render
renderRandomTracks();

// Shuffle button
document.getElementById('shuffleBtn').addEventListener('click', renderRandomTracks);
