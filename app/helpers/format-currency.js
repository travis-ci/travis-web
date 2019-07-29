import { helper } from '@ember/component/helper';

export function formatCurrency([value, ...rest], { floor }) {
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    return value;
  }
  const dollars = parsedValue / 100;
  return floor ? `$${Math.floor(dollars)}` : `$${dollars.toFixed(2)}`;
}

export default helper(formatCurrency);
