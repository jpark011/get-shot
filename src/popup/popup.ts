const root = document.querySelector('#root');
const button = document.querySelector('#go-stop-btn');
const alarm = document.querySelector<HTMLAudioElement>('#alarm');
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
    onSuccess(msg.key);
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

function onSuccess(key) {
  chrome.notifications.create('', {
    type: 'basic',
    title: 'getShot 백신예약',
    message: '백신예약 성공!',
    iconUrl: '../../assets/icon.png',
  });
  alarm?.play();

  setTimeout(
    () =>
      chrome.tabs.create({
        url: `https://v-search.nid.naver.com/reservation/success?key=${key}`,
      }),
    1000
  );
}
