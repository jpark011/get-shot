import { searching, startSearch, stopSearch } from './src/search/index.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({
    path: {
      '16': `../../assets/icon-gray.png`,
    },
  });
});

chrome.runtime.onMessage.addListener((msg, _, res) => {
  switch (msg.cmd) {
    case 'start':
      if (searching) {
        return 'searching already started';
      }

      const { x, y } = msg;

      startSearch(x, y);

      return 'searching started';
    case 'stop':
      stopSearch();

      return 'searching stopped';
    default:
  }
});

chrome.runtime.onSuspend.addListener(async () => {
  await stopSearch();
  return true;
});
