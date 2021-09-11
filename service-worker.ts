import { searching, startSearch, stopSearch } from './src/search/index.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({
    path: {
      '16': `../../assets/icon-gray.png`,
    },
  });
});

chrome.runtime.onMessage.addListener((msg, _, res) => {
  if (msg.cmd === 'start') {
    if (searching) {
      res('searching already started');
      return;
    }

    const { x, y } = msg;

    startSearch(x, y);
    res('searching started');
  } else {
    stopSearch();
    res('searching stopped');
  }
});
