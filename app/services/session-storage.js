import StorageService from 'travis/services/storage';
import { isFastboot, sessionStorage } from 'travis/utils/fastboot';

export default StorageService.extend({

  get storage() {
    return isFastboot ? sessionStorage : window.sessionStorage;
  }

});
