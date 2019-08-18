import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default function prefix(key, prefix,
  {
    dictionary = {},
    validator = isPresent,
    separator = '-',
    defaultValue = null,
    negatable = false,
  } = {}
) {
  return computed(key, function () {
    const propVal = this.get(key);
    const value = dictionary[propVal] || propVal;
    const isNegative = negatable && typeof value === 'number' && value < 0;
    const negator = isNegative ? '-' : '';

    // Removes extra dash from negative vals, for negatable props like margin etc.
    const displayVal = isNegative ? Math.abs(value) : value;

    return validator(value) ? `${negator}${prefix}${separator}${displayVal}` : defaultValue;
  });
}
