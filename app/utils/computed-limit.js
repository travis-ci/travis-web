import Ember from 'ember';

var limit = function(dependentKey, limitKey) {
  var options = {
    addedItem: function(array, item, changeMeta) {
      var limit = Ember.get(this, limitKey);
      if (changeMeta.index < limit) {
        array.insertAt(changeMeta.index, item);
        if (Ember.get(array, "length") > limit) {
          array.popObject();
        }
      }
      return array;
    },
    removedItem: function(array, item, changeMeta) {
      var limit = Ember.get(this, limitKey);
      if (changeMeta.index < limit && changeMeta.index < Ember.get(array, 'length')) {
        array.removeAt(changeMeta.index, 1);
        var toPush = changeMeta.arrayChanged.objectAt(limit);
        if (toPush) {
          array.pushObject(toPush);
        }
      }
      return array;
    }
  };
  return Ember.arrayComputed(dependentKey, limitKey, options);
};

export default limit;
