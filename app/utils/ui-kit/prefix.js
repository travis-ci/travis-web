import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import config from 'travis/config/environment';

const { screens } = config;
const screenPrefixes = Object.values(screens)
  .map((screen) => screen.prefix)
  .filter(val => val.length > 0);

export default function prefixUtil(key, prefix,
  {
    dictionary = {},
    validator = isPresent,
    separator = '-',
    defaultValue = null,
    negatable = false,
  } = {}
) {
  const screenDetails = [
    { key: `${key}.base`, prefix: '' },
    ...screenPrefixes.map((screen) => ({
      key: `${key}.${screen}`,
      prefix: `${screen}:`,
    })),
  ];
  const keysToCheck = [key, ...screenDetails.map((screen) => screen.key)];

  return computed(...keysToCheck, function () {
    const classes = screenDetails.map((screen, index) => {
      const {key: screenKey, prefix: screenPrefix } = screen;

      const propVal = index === 0
        ? this.get(screenKey) || this.get(key)
        : this.get(screenKey);

      const value = dictionary[propVal] || propVal;
      const isNegative = negatable && typeof value === 'number' && value < 0;
      const negator = isNegative ? '-' : '';

      // Removes extra dash from negative vals, for negatable props like margin etc.
      const displayVal = isNegative ? Math.abs(value) : value;

      return validator(value) ? `${screenPrefix}${negator}${prefix}${separator}${displayVal}` : defaultValue;
    });

    return classes.compact().join(' ');
  });
}
