import StorageService from 'travis/services/storage';

export default StorageService.extend({

  get storage() {
    return window.sessionStorage;
  }

});
