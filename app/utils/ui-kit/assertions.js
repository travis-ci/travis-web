import { assert } from '@ember/debug';
import { isNone, isPresent } from '@ember/utils';
import { getResponsiveProp, screenKeys } from 'travis/utils/ui-kit/responsive';

export function checkDictionary(value, dictionary, propertyName = '', componentName = '') {
  // Allow null/undefined values
  if (isNone(value)) {
    return true;
  }

  const screenVals = getResponsiveProp(value);

  const conflicts = screenKeys.map((screen) => {
    const currentVal = screenVals[screen];

    if (isNone(currentVal)) {
      return true;
    }

    const found = Object.values(dictionary).includes(currentVal);
    assert(
      `${propertyName} "${currentVal}" is not allowed on this ${componentName} component`,
      found
    );
    return found;
  }).filter(found => found === false);

  return conflicts.length === 0;
}

export function requireProp(value, propertyName = '', componentName = '') {
  const screenVals = getResponsiveProp(value);

  for (const screen of screenKeys) {
    const currentVal = screenVals[screen];
    const found = isPresent(currentVal);
    if (found) {
      return true;
    }
  }

  assert(
    `${propertyName} property must be present on this ${componentName} component. Current value: ${value}`,
    false
  );

  return false;
}
