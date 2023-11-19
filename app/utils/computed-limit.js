import { computed, get } from '@ember/object';

let limit = function (dependentKey, limitKey) {
  return computed(dependentKey, `${dependentKey}.[]`, function () {
    let limit = get(this, limitKey),
      array = this.get(dependentKey);

    return array ? array.slice(0, limit) : [];
  });
};

export default limit;
