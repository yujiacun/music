// app.js - Individual group track page
const params = new URLSearchParams(window.location.search);
const group = params.get('group');

if (!group) {
  alert('No group provided');
}

let baseTracks = tracks.filter(t => t.group === group);

// Set page title and meta description
const displayName = groupNames[group] || group;
document.title = displayName + ' (' + baseTracks.length + ') - Mix Repo';
setMetaDescription('Browse ' + baseTracks.length + ' mixes from ' + displayName + ' on Mix Repo.');

const page = createTrackPage(() => baseTracks);
page.applySortAndRender('latest');
