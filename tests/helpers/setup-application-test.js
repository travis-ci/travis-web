import { setupApplicationTest } from 'ember-qunit';
import signOutUser from './sign-out-user';

export function setupApplicationTestCustom(hooks) {
  hooks.beforeEach(function () {
    signOutUser();
  });
  return setupApplicationTest(...arguments);
}
