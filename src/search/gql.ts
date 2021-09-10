export const queryVaccineList = `
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
`;
