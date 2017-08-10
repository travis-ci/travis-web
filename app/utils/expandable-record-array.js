import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.ArrayProxy.extend({
  isLoaded: false,
  isLoading: false,

  @computed()
  promise() {
    return new Ember.RSVP.Promise((resolve) => {
      let observer = () => {
        if (this.get('isLoaded')) {
          resolve(this);
          this.removeObserver('isLoaded', observer);
          return true;
        }
      };
      if (!observer()) {
        return this.addObserver('isLoaded', observer);
      }
    });
  },

  load(array) {
    this.set('isLoading', true);
    return array.then(() => {
      array.forEach((record) => {
        if (!this.includes(record)) {
          return this.pushObject(record);
        }
      });
      this.set('isLoading', false);
      return this.set('isLoaded', true);
    });
  },

  observe(collection) {
    return collection.addArrayObserver(this, {
      willChange: 'observedArrayWillChange',
      didChange: 'observedArraydidChange'
    });
  },

  observedArrayWillChange(array, index, removedCount) {
    let i, len, object, removedObjects, results;
    removedObjects = array.slice(index, index + removedCount);
    results = [];
    for (i = 0, len = removedObjects.length; i < len; i++) {
      object = removedObjects[i];
      results.push(this.removeObject(object));
    }
    return results;
  },

  observedArraydidChange(array, index, removedCount, addedCount) {
    let addedObjects, i, len, object, results;
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
