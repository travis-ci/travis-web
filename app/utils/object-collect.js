import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default function objectCollect(...keys) {
  return computed(...keys, function () {
    const result = keys.reduce((collection, key) => {
      const item = this.get(key);
      if (isPresent(item)) {
        collection[key] = item;
      }
      return collection;
    }, {});

    return result;
  });
}
