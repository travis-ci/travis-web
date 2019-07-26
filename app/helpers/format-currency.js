import { helper } from '@ember/component/helper';

export function formatCurrency([value, ...rest]) {
  if (!Number(value)) {
    return value;
  }
  const dollars = Math.floor(Number(value) / 100);
  return `$${dollars}`;
}

export default helper(formatCurrency);
