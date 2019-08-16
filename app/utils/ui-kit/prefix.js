import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default function prefix(key, prefix, validator = isPresent, separator = '-', defaultValue) {
  return computed(key, function () {
    const value = this.get(key);
    return validator(value) ? `${prefix}${separator}${value}` : defaultValue;
  });
}
