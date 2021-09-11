import {
  getVaccineList,
  getHospitalWithVaccine,
  VACCINE_CODES,
} from './vaccine.js';
import { progress, standby, confirm, RESERVATION_URL } from './reservation.js';

export let searching: number | null = null;

export function startSearch(x: number, y: number, interval = 2000) {
  searching = setInterval(() => search(x, y), interval);
  chrome.storage.local.set({ searching });
}

export async function stopSearch() {
  searching && clearInterval(searching);
  searching = null;
  await chrome.storage.local.remove('searching');
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
      chrome.runtime.sendMessage({ cmd: 'success', key });
    }
  } catch (e) {
    console.warn(e);
  }
}
