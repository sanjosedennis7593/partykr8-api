export const convertToCurrencyFormat = value => {
    return value && value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  