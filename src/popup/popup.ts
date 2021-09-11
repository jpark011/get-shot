const root = document.querySelector('#root');
const button = document.querySelector('#go-stop-btn');
let x, y;

navigator.geolocation.getCurrentPosition(({ coords }) => {
  x = coords.longitude;
  y = coords.latitude;
});

button?.addEventListener('click', () => {
  const searching = root?.getAttribute('searching') !== null;

  searching ? stopSearching() : startSearching();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.cmd === 'success') {
    stopSearching();
  }
});

function stopSearching() {
  chrome.runtime.sendMessage({ cmd: 'stop' }, () => {
    root?.removeAttribute('searching');
  });
}

function startSearching() {
  chrome.runtime.sendMessage({ cmd: 'start', x, y }, () => {
    root?.setAttribute('searching', '');
  });
}
