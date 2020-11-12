import { helper } from '@ember/component/helper';

export function formatCurrency(value) {
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    return value;
  }

  return parsedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default helper(formatCurrency);
