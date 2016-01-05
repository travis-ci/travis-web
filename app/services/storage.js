import Ember from 'ember';
import Storage from 'travis/utils/hash-storage';

export default Ember.Service.extend({
  init: function() {
    var err, storage;
    storage = null;
    try {
      storage = window.localStorage || (function() {
        throw 'no storage';
      })();
    } catch (error) {
      err = error;
      storage = Storage.create();
    }
    return this.set('storage', storage);
  },
  getItem: function(key) {
    return this.get("storage").getItem(key);
  },
  setItem: function(key, value) {
    return this.get("storage").setItem(key, value);
  },
  removeItem: function(key) {
    return this.get("storage").removeItem(key);
  },
  clear: function() {
    return this.get("storage").clear();
  }
});
