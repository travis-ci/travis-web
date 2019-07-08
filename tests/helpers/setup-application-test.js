import { setupApplicationTest as _super } from 'ember-qunit';
import signOutUser from 'travis/tests/helpers/sign-out-user';

export function setupApplicationTest(hooks) {
  hooks.beforeEach(function () {
    signOutUser();

    localStorage.clear();
    sessionStorage.clear();
  });
  return _super(...arguments);
}
