import { setupApplicationTest as _super } from 'ember-qunit';

export function setupApplicationTest() {
  let clearStorage = (storage) => {
    storage.removeItem('travis.token');
    storage.removeItem('travis.user');
  };

  clearStorage(localStorage);
  clearStorage(sessionStorage);

  return _super(...arguments);
}
