import { setupApplicationTest as _super } from 'ember-qunit';

export function setupApplicationTest(hooks) {
  hooks.beforeEach(function () {
    localStorage.clear();
    sessionStorage.clear();
  });
  return _super(...arguments);
}
