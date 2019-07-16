import Service from '@ember/service';
import Storage from 'travis/utils/hash-storage';

export default Service.extend({
  init() {
    let storage;
    try {
      storage = window.localStorage || ((() => {
        throw 'no storage';
      }))();
    } catch (error) {
      storage = Storage.create();
    }
    return this.set('storage', storage);
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
