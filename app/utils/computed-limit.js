import Ember from 'ember';

let limit = function (dependentKey, limitKey) {
  return Ember.computed(dependentKey, `${dependentKey}.[]`, function () {
    let limit = Ember.get(this, limitKey),
      array = this.get(dependentKey);

    return array ? array.toArray().slice(0, limit) : [];
  });
};

export default limit;
