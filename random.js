const grid = document.getElementById('grid');

// Shuffle helper
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
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
