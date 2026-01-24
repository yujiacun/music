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
function getRandomTracksLimited(tracksArray, count = 12, maxPerGroup = 2) {
  const shuffled = shuffle([...tracksArray]);
  const groupCount = {};       // Track how many tracks we already picked per group
  const result = [];

  for (const track of shuffled) {
    if (!groupCount[track.group]) groupCount[track.group] = 0;

    if (groupCount[track.group] < maxPerGroup) {
      result.push(track);
      groupCount[track.group]++;
    }

    if (result.length >= count) break;
  }

  return result;
}

// Render tracks
function renderRandomTracks() {
  grid.innerHTML = '';
  const randomTracks = getRandomTracksLimited(tracks, 12, 2);

  randomTracks.forEach(track => {
    const iframe = document.createElement('iframe');
    iframe.className = 'sc-player';
    iframe.dataset.track = track.id;
    iframe.title = track.title;
    iframe.loading = 'lazy';
    iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.id}&color=%23f60808&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true`;
    grid.appendChild(iframe);
  });
}

// Initial render
renderRandomTracks();

// Shuffle button
document.getElementById('shuffleBtn').addEventListener('click', renderRandomTracks);
