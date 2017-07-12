import Ember from 'ember';

export default Ember.ArrayProxy.extend({
  isLoaded: false,
  isLoading: false,

  promise: Ember.computed(function () {
    var self;
    self = this;
    return new Ember.RSVP.Promise(function (resolve) {
      var observer;
      observer = function () {
        if (self.get('isLoaded')) {
          resolve(self);
          self.removeObserver('isLoaded', observer);
          return true;
        }
      };
      if (!observer()) {
        return self.addObserver('isLoaded', observer);
      }
    });
  }),

  load(array) {
    this.set('isLoading', true);
    return array.then((function (_this) {
      return function () {
        array.forEach(function (record) {
          if (!_this.includes(record)) {
            return _this.pushObject(record);
          }
        });
        _this.set('isLoading', false);
        return _this.set('isLoaded', true);
      };
    })(this));
  },

  observe(collection) {
    return collection.addArrayObserver(this, {
      willChange: 'observedArrayWillChange',
      didChange: 'observedArraydidChange'
    });
  },

  observedArrayWillChange(array, index, removedCount) {
    var i, len, object, removedObjects, results;
    removedObjects = array.slice(index, index + removedCount);
    results = [];
    for (i = 0, len = removedObjects.length; i < len; i++) {
      object = removedObjects[i];
      results.push(this.removeObject(object));
    }
    return results;
  },

  observedArraydidChange(array, index, removedCount, addedCount) {
    var addedObjects, i, len, object, results;
    addedObjects = array.slice(index, index + addedCount);
    results = [];
    for (i = 0, len = addedObjects.length; i < len; i++) {
      object = addedObjects[i];
      // TODO: I'm not sure why deleted objects get here, but I'll just filter them
      // for now
      if (!object.get('isDeleted')) {
        if (!this.includes(object)) {
          results.push(this.pushObject(object));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  },

  pushObject(record) {
    let content = this.get('content');
    if (content) {
      if (!content.includes(record)) {
        return content.pushObject(record);
      }
    }
  }
});
