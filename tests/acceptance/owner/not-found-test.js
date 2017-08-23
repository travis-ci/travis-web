import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import nonExistentOwnerPage from 'travis/tests/pages/owner/non-existent';
import { percySnapshot } from 'ember-percy';

let adapterException;
let loggerError;

moduleForAcceptance('Acceptance | owner/not found', {
  beforeEach() {
    // Ignore promise rejection.
    // Original exception will fail test on promise rejection.
    adapterException = Ember.Test.adapter.exception;
    loggerError = Ember.Logger.error;
    Ember.Test.adapter.exception = () => null;
    Ember.Logger.error = () => null;
  },

  afterEach() {
    Ember.Test.adapter.exception = adapterException;
    Ember.Logger.error = loggerError;
  }
});

test('visiting /non-existent-owner shows error message when authenticated', function (assert) {
  const user = server.create('user');
  signInUser(user);

  nonExistentOwnerPage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/non-existent-owner');
    assert.ok(nonExistentOwnerPage.showsBarricadeIllustration, 'Shows image for aesthetics');
    assert.equal(nonExistentOwnerPage.errorMessage, 'We couldn\'t find the owner non-existent-owner', 'Shows message that repository was not found');
    assert.ok(nonExistentOwnerPage.errorMessageProisHidden, 'does not show .com authenticated message');
  });
});

test('visiting /non-existent-owner shows error message when unauthenticated', function (assert) {
  withFeature('proVersion');
  nonExistentOwnerPage.visit();

  andThen(function () {
    percySnapshot(assert);
    assert.equal(currentURL(), '/non-existent-owner');
    assert.ok(nonExistentOwnerPage.showsBarricadeIllustration, 'Shows image for aesthetics');
    assert.equal(nonExistentOwnerPage.errorMessage, 'We couldn\'t find the owner non-existent-owner', 'Shows message that repository was not found');
    assert.ok(nonExistentOwnerPage.errorMessageProUnauthenticated, 'shows .com authenticated message');
  });
});
