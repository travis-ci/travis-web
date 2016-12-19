import StorageService from 'travis/services/storage';
import Storage from 'travis/utils/hash-storage';

export default StorageService.extend({
  init() {
    let storage;
    try {
      // firefox will not throw error on access for sessionStorage var,
      // you need to actually get something from session
      window.sessionStorage.getItem('foo');
      storage = window.sessionStorage;
    } catch (error) {
      storage = Storage.create();
    }
    return this.set('storage', storage);
  }
});
