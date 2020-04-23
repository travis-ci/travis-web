import { assert } from '@ember/debug';
import { isNone, isPresent } from '@ember/utils';
import { A } from '@ember/array';
import { getResponsiveProp, screenKeys } from 'travis/utils/ui-kit/responsive';
import { colorExists } from 'travis/utils/ui-kit/colors';

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

export function getValuesToCheck(inputValue) {
  const responsivePropMap = getResponsiveProp(inputValue);
  return A(Object.values(responsivePropMap)).compact().without('');
}

export function checkColor({value, dictionary, property = '@color', component = ''} = {}) {
  // Allow null/undefined values
  if (isNone(value)) {
    return true;
  }
  const valuesToCheck = getValuesToCheck(value);
  const dictVals = Object.values(dictionary);
  const conflicts = A();

  for (const currentValue of valuesToCheck) {
    if (colorExists(currentValue)) {
      continue;
    }
    if (dictVals.includes(currentValue)) {
      continue;
    }
    conflicts.push(currentValue);
  }

  assert(
    `${property} "${conflicts}" is not allowed on this ${component} component`,
    !conflicts.length
  );
}
