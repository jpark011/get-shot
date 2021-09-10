import { queryVaccineList } from './gql';

export const VACCINE_CODES = {
  화이자: 'VEN00013',
  모더나: 'VEN00014',
  AZ: 'VEN00015',
  얀센: 'VEN00016',
  노바백스: 'VEN00017',
  시노팜: 'VEN00018',
  시노백: 'VEN00019',
  스푸트니크V: 'VEN00020',
};

export async function getVaccineList(x: string, y: string) {
  return await fetch('https://api.place.naver.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'vaccineList',
      variables: {
        input: {
          keyword: '코로나백신위탁의료기관',
          x,
          y,
        },
        businessesInput: {
          start: 0,
          display: 100,
          deviceType: 'mobile',
          x,
          y,
          sortingOrder: 'distance',
        },
        isNmap: false,
        isBounds: false,
      },
      query: queryVaccineList,
    }),
  })
    .then((res) => res.json())
    .then((json) => json.data.rests.businesses.items);
}

export function getHospitalWithVaccine(vaccineList: any[]) {
  if (!Array.isArray(vaccineList)) {
    return null;
  }

  const hospital = vaccineList
    .filter(({ vaccineQuantity: { list } }) =>
      list
        .filter(
          ({ vaccineType, quantity }) =>
            quantity > 0 &&
            (vaccineType === '화이자' || vaccineType === '모더나')
        )
        .shift()
    )
    .shift();

  return hospital || null;
}
