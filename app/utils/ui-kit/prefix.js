import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import config from 'travis/config/environment';
import getResponsiveProp from 'travis/utils/ui-kit/get-responsive-prop';

const { screens } = config;
const screenKeys = Object.keys(screens);

export default function generatePrefix(key, propPrefix,
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
    const screenVals = getResponsiveProp(propVal);

    const classes = screenKeys.map((screen) => {
      const screenVal = screenVals[screen];

      const screenInfo = screens[screen];
      const screenPrefix = screen === 'base' ? '' : `${screenInfo.prefix}:`;

      const value = dictionary[screenVal] || screenVal;
      const isNegative = negatable && typeof value === 'number' && value < 0;
      const negator = isNegative ? '-' : '';

      // Removes extra dash from negative vals, for negatable props like margin etc.
      const displayVal = isNegative ? Math.abs(value) : value;

      return validator(value) ? `${screenPrefix}${negator}${propPrefix}${separator}${displayVal}` : defaultValue;
    });

    return classes.compact().join(' ');
  });
}
