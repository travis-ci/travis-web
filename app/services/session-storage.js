import StorageService from 'travis/services/storage';
import Storage from 'travis/utils/hash-storage';

export default StorageService.extend({

  get storage() {
    return window.sessionStorage || Storage.create();
  }

});
