import { helper } from '@ember/component/helper';

export function truncate([value, truncateTo]) {
  if (!value || value.length <= 3 || value.length <= truncateTo - 3) {
    return value;
  }

  return `${value.substring(0, truncateTo - 3)}...`;
}

export default helper(truncate);
