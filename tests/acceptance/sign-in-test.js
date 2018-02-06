import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import Service from '@ember/service';

moduleForAcceptance('Acceptance | sign in');

test('visiting /signin starts auth flow if unauthenticated', function (assert) {
  assert.expect(2);

  // avoid actually contacting GitHub
  const mockAuthService = Service.extend({
    signedIn: false,
    signIn() {
      assert.ok(true);
    },
    afterSignOut() {
      return undefined;
    },
    autoSignIn() {
      return undefined;
    },
  });

  const instance = this.application.__deprecatedInstance__;
  const registry = instance.register ? instance : instance.registry;
  registry.register('service:auth', mockAuthService);

  visit('/signin');

  andThen(function () {
    assert.equal(currentURL(), '/signin');
  });
});

test('visiting signin redirects to index if authenticated', function (assert) {
  const currentUser = server.create('user', 'withRepository');

  signInUser(currentUser);

  visit('/signin');

  andThen(function () {
    assert.equal(currentURL(), '/');
  });
});
