import { helper } from '@ember/component/helper';

export function formatCurrency([value, ...rest], namedArgs) {
  if (isNaN(Number(value))) {
    return value;
  }
  const dollars = Number(value) / 100;
  return namedArgs.fixed ? `$${dollars.toFixed(2)}` : `$${Math.floor(dollars)}`;
}

export default helper(formatCurrency);
