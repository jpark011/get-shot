async function startSearch(x = '126.63070259087937', y = '37.53697738522249') {
  const vaccineList = await fetch('https://api.place.naver.com/graphql', {
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
      query: `
      query vaccineList($input: RestsInput, $businessesInput: RestsBusinessesInput) {
        rests(input: $input) {
          businesses(input: $businessesInput) {
            total
            vaccineLastSave
            isUpdateDelayed
            items {
              id
              name
              phone
              roadAddress
              x
              y
              vaccineQuantity {
                totalQuantity
                startTime
                endTime
                vaccineOrganizationCode
                list {
                  quantity
                  quantityStatus
                  vaccineType
                }
              }
            }
          }
        }
      }
    `,
    }),
  })
    .then((res) => res.json())
    .then((json) => json.data.rests.businesses.items);

  if (!Array.isArray(vaccineList)) {
    return;
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

  if (!hospital || !interval) {
    return;
  }

  clearInterval(interval);
  interval = undefined;

  document.querySelector('#container').innerHTML = '백신 찾았다...!';
  fetch('', { headers: { 'Upgrade-Insecure-Requests': 1 }, referrer });

  new Audio(
    'https://freesound.org/data/previews/122/122255_1074082-lq.mp3'
  ).play();

  open(
    `https://v-search.nid.naver.com/reservation/standby?orgCd=${hospital.vaccineQuantity.vaccineOrganizationCode}&sid=${hospital.id}`
  );
}
