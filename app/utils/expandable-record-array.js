import { Promise as EmberPromise } from 'rsvp';
import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';

export default ArrayProxy.extend({
  _content: [],
  isLoaded: computed({
    get() {
      console.log("isloaded?");
      return true;
    },
    set(k,v) {
      console.log("isloaded!");
      return true;
    }
  }),
  isLoading: false,

  promise: computed(function () {
    return new EmberPromise((resolve) => {
      let observer = () => {
        if (this.isLoaded) {
          resolve(this);
          this.removeObserver('isLoaded', observer);
          return true;
        }
      };
      if (!observer()) {
        return this.addObserver('isLoaded', observer);
      }
    });
  }),

  load(array) {
    console.log("LOAD");
    console.log(array);
    return array.then(() => {
      console.log("FE1");
      array.forEach((record) => {
        console.log(record);
        if (!this.includes(record)) {
          console.log("FEPUSH");
          return this.pushObject(record);
        }
      });
      console.log("FE2");
      array.set('isLoading', false);
      return array.set('isLoaded', true);
    });
  },

  observe(collection) {
    return new Proxy(collection, {
      set(target, prop, value) {
        console.log(prop," to " , value);
        return Reflect.set(...arguments);
      },
      get(target, prop) {
        console.log("get", target, ": ", prop);
        return target[prop];
      }
    });
    return this;
  },

  set: function(prop, value) {
    console.log("SET1 " + prop );
    this._content.set(prop, value);
  },
  
  push: function(val) {
    console.log("PUSH");
    if(this._content) {
    this.observedArrayWillChange(this._content, this._content.length - 1, 0);
    }
    this._content.push(val);
    this.observedArrayDidChange(this._content, this._content.length - 1, 0, 1);
    return this._content.length
  },
  pushObject: function(val) {
    console.log("PUSHOBJ");
    return this.push(val);
  },

  pushObjects: function(...val) {
    console.log("PUSHOBJS");
    return this._content.pushObjects(...val);
  },
  addObject: function(val) {
    console.log("ADDOBJ");
    return this.push(val);
  },
  forEachx: function(...val) {
    console.log("ADD");
    return this._content.forEach(...val);
  },
  content: function() {
    console.log("CONTENT");
    return this._content;
  },

  observedArrayWillChange(array, index, removedCount) {
    let i, len, object, removedObjects, results;
    console.log("WILLCHANGE");
    console.log(array);
    
    removedObjects = array.slice(index, index + removedCount);
    results = [];
    for (i = 0, len = removedObjects.length; i < len; i++) {
      object = removedObjects[i];
 //     results.push(this.removeObject(object));
      results.push(0);
    }
    return results;
  },

  observedArrayDidChange(array, index, removedCount, addedCount) {
    let addedObjects, i, len, object, results;
    console.log("DIDCHANGE");
    addedObjects = array.slice(index, index + addedCount);
    results = [];
    
    for (i = 0, len = addedObjects.length; i < len; i++) {
      object = addedObjects[i];
      // TODO: I'm not sure why deleted objects get here, but I'll just filter them
      // for now
      if (!object.get('isDeleted')) {
        if (!this.includes(object)) {
   // results.push(this._content.pushObject(object));
          results.push(0);
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  },

  xpushObject(record) {
    let _content = this._content;
    if (_content) {
      if (!_content.includes(record)) {
        return _content.pushObject(record);
      }
    }
  }
});
