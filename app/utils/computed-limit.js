import Ember from 'ember';

var limit = function(dependentKey, limitKey) {
  return Ember.computed(dependentKey, dependentKey + ".[]", function() {
    var limit = Ember.get(this, limitKey),
        array = this.get(dependentKey);

    return array.toArray().slice(0, limit);
  });
};

export default limit;
