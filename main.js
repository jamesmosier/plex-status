require('dotenv').config();

const electron = require('electron');
const { app, BrowserWindow, Tray } = electron;

const isDevelopment = process.env.NODE_ENV !== 'production';

const path = require('path');
const url = require('url');
const menubar = require('menubar');
const PlexAPI = require('plex-api');

const millisToMins = require('./utils/millis-to-mins');

const plexOptions = {
  hostname: '127.0.0.1',
  username: process.env.PLEX_USERNAME,
  password: process.env.PLEX_PASSWORD,
};
const client = new PlexAPI(plexOptions);
const mb = menubar({ icon: 'static/icon.png' });

mb.on('after-create-window', () => {
  if (isDevelopment) {
    mb.window.openDevTools();
  }
});

mb.on('ready', () => {
  getSessionStatus();

  setInterval(() => {
    getSessionStatus();
  }, 5000); // 60000
});

function toggleIcon(isActive) {
  console.log('Icon is active?', isActive);
  const iconName = isActive ? 'icon-active' : 'icon';
  mb.tray.setImage(`static/${iconName}.png`);
}

async function getSessionStatus() {
  try {
    const resp = await client.query('/status/sessions');
    console.log(resp);
    const data = resp.MediaContainer;

    if (!data.size || data.size === 0) {
      // nothing playing right now
      toggleIcon(false);
      return;
    }

    const runningVideos = data.Video.map((vid) => {
      return {
        title: vid.title,
        type: vid.type,
        duration: millisToMins(vid.duration),
        thumb: vid.thumb,
        art: vid.art,
      };
    });

    toggleIcon(true);
  } catch (e) {
    console.log('Error getting session status', e);
  }
}
