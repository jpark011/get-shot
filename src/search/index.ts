import {
  getVaccineList,
  getHospitalWithVaccine,
  VACCINE_CODES,
} from './vaccine.js';
import { progress, standby, confirm, RESERVATION_URL } from './reservation.js';
export let searching: number | null = null;

export function startSearch(x: number, y: number, interval = 2000) {
  searching = setInterval(() => search(x, y), interval);
}

export function stopSearch() {
  searching && clearInterval(searching);
  searching = null;
}

async function search(x: number, y: number) {
  try {
    const vaccineList = await getVaccineList(`${x}`, `${y}`);
    const hospital = getHospitalWithVaccine(vaccineList);

    if (!hospital) {
      return;
    }

    const key = await standby(
      hospital.vaccineQuantity.vaccineOrganizationCode,
      hospital.id
    );
    const vaccine = hospital.vaccineQuantity.list.shift();
    const code = VACCINE_CODES[vaccine.vaccineType];

    await progress(key, code);
    const success = await confirm(key);

    if (success) {
      onSuccess(key);
    }
  } catch (e) {
    console.warn(e);
  }
}

function onSuccess(key) {
  chrome.runtime.sendMessage({ cmd: 'success' });
  new Audio(
    'https://freesound.org/data/previews/122/122255_1074082-lq.mp3'
  ).play();
  chrome.tabs.create({ url: `${RESERVATION_URL}/success?key=${key}` });
}
