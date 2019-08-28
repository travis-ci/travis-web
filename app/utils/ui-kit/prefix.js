import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import getResponsiveProp, { screens, screenKeys } from 'travis/utils/ui-kit/get-responsive-prop';


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
    // Helps handle complex values, like padding.top
    const [primeKey, subKey] = key.split('.');

    const propVal = this.get(primeKey);
    const screenVals = getResponsiveProp(propVal);

    const classes = screenKeys.map((screen) => {
      const screenVal = screenVals[screen];
      const simpleVal = isPresent(screenVal) && isPresent(subKey) ? screenVal[subKey] : screenVal;

      const screenInfo = screens[screen];
      const screenPrefix = screen === 'base' ? '' : `${screenInfo.prefix}:`;

      const value = dictionary[simpleVal] || simpleVal;
      const isNegative = negatable && typeof value === 'number' && value < 0;
      const negator = isNegative ? '-' : '';

      // Removes extra dash from negative vals, for negatable props like margin etc.
      const displayVal = isNegative ? Math.abs(value) : value;

      return validator(value) ? `${screenPrefix}${negator}${propPrefix}${separator}${displayVal}` : defaultValue;
    });

    return classes.compact().join(' ');
  });
}
