const ipc = require('electron').ipcRenderer;

ipc.once('dataResp', (event, response) => {
  bindDataToView(response);
});

ipc.send('getPlexData', 'someData');

function bindDataToView(response) {
  const video = response[0];
  document.getElementById('title').innerHTML += `${video.showName} - ${video.episodeTitle}`;
}
