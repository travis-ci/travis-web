import { helper } from '@ember/component/helper';

export function formatNumber(value) {
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    return value;
  }

  const browserLanguage = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
  let formatter = new Intl.NumberFormat(browserLanguage);
  let formattedNumber = formatter.format(parsedValue);

  return formattedNumber;
}

export default helper(formatNumber);
