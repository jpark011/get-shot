import {
  getVaccineList,
  getHospitalsWithVaccine,
  VACCINE_CODES,
} from './vaccine.js';
import { progress, standby, confirm } from './reservation.js';

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
    const hospitals = getHospitalsWithVaccine(vaccineList);

    if (hospitals.length <= 0) {
      return;
    }

    for (const hospital of hospitals) {
      const key = await standby(
        hospital.vaccineQuantity.vaccineOrganizationCode,
        hospital.id
      );
      const vaccine = hospital.vaccineQuantity.list.find(
        ({ vaccineType }) => vaccineType === '화이자'
      );

      if (!key || !vaccine) {
        return;
      }

      const code = VACCINE_CODES[vaccine.vaccineType];

      await progress(key, code);
      const success = await confirm(key);

      if (success) {
        chrome.runtime.sendMessage({ cmd: 'success', key });
        break;
      }
    }
  } catch (e) {
    console.warn(e);
  }
}
