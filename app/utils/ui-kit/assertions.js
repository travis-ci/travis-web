import { assert } from '@ember/debug';

export function checkDictionary(value, dictionary, propertyName = '', componentName = '') {
  // Allow null/undefined values
  if (value === null || value === undefined) {
    return true;
  }

  const found = Object.values(dictionary).includes(value);
  assert(
    `${propertyName} "${value}" is not allowed on this ${componentName} component`,
    found
  );
  return found;
}

export function requireProp(value, propertyName = '', componentName = '') {
  const found = typeof value !== 'undefined' && value !== null;
  assert(
    `${propertyName} property must be present on this ${componentName} component. Current value: ${value}`,
    found
  );
  return found;
}
