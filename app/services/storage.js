import Service from '@ember/service';
import Storage from 'travis/utils/hash-storage';

export default Service.extend({

  get storage() {
    return window.localStorage || Storage.create();
  },

  getItem(key) {
    return this.storage.getItem(key);
  },

  setItem(key, value) {
    return this.storage.setItem(key, value);
  },

  removeItem(key) {
    return this.storage.removeItem(key);
  },

  clear() {
    return this.storage.clear();
  }

});
