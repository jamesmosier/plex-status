const ipc = require('electron').ipcRenderer;

ipc.once('dataResp', (event, response) => {
  bindDataToView(response);
});

ipc.send('getPlexData', 'someData');

function bindDataToView(response) {
  document.getElementById('title').innerHTML += response[0].title;
}
