export async function standby(orgCd, id) {
  const url = new URL('https://v-search.nid.naver.com/reservation/standby');
  url.search = new URLSearchParams({ orgCd, id }).toString();

  return await fetch(url.toString()).then((res) => res.url.split('key=')[1]);
}

export async function progress(key, cd) {
  const url = new URL('https://v-search.nid.naver.com/reservation/standby');
  url.search = new URLSearchParams({ key, cd }).toString();

  return await fetch(url.toString());
}

export async function confirm(key) {
  const url = new URL('https://v-search.nid.naver.com/reservation/confirm');
  url.search = new URLSearchParams({ key }).toString();

  return await fetch(url.toString(), { method: 'POST' })
    .then((res) => res.json())
    .then((res) => res.code === 'SUCCESS');
}
