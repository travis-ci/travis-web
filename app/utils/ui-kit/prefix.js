import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import config from 'travis/config/environment';

const { screens } = config;
const screenList = Object.values(screens);
const screenPrefixes = screenList.map((screen) => screen.prefix);

function getScreenKey(screen, key) {
  return screen.length > 0 ? `${screen}${key.capitalize()}` : key;
}

export default function prefixUtil(key, prefix,
  {
    dictionary = {},
    validator = isPresent,
    separator = '-',
    defaultValue = null,
    negatable = false,
    responsive = false,
  } = {}
) {
  const screensToProcess = responsive ? screenPrefixes : [''];
  const propsToWatch = screensToProcess.map((screen) => getScreenKey(screen, key));

  return computed(...propsToWatch, function () {
    const classes = screenPrefixes.reduce((classList, screen) => {
      const screenKey = getScreenKey(screen, key);
      const screenVal = this.get(screenKey);
      const screenPrefix = screen.length > 0 ? `${screen}:` : '';

      const value = dictionary[screenVal] || screenVal;
      const isNegative = negatable && typeof value === 'number' && value < 0;
      const negator = isNegative ? '-' : '';

      // Removes extra dash from negative vals, for negatable props like margin etc.
      const displayVal = isNegative ? Math.abs(value) : value;

      const currentValue = validator(value) ? `${screenPrefix}${negator}${prefix}${separator}${displayVal}` : defaultValue;

      classList.push(currentValue);

      return classList;
    }, []);

    return classes.compact().join(' ');
  });
}
