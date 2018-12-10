import { setupApplicationTest as _super } from 'ember-qunit';
import signOutUser from 'travis/tests/helpers/sign-out-user';

export function setupApplicationTest(hooks) {
  hooks.beforeEach(function () {
    signOutUser();
  });
  return _super(...arguments);
}
