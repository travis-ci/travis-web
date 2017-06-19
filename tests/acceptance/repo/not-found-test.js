import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import nonExistentRepoPage from 'travis/tests/pages/repo/non-existent';

let adapterException;
let loggerError;

moduleForAcceptance('Acceptance | repo/not found', {
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

test('visiting /non-existent/repository shows error message when authenticated', function (assert) {
  const user = server.create('user');
  signInUser(user);

  nonExistentRepoPage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/non-existent/repository');
    assert.ok(nonExistentRepoPage.showsTravisImage, 'Shows image for aesthetics');
    assert.equal(nonExistentRepoPage.errorMessage, 'The repository at non-existent/repository was not found.', 'Shows message that repository was not found');
  });
});

test('visiting /non-existent/repository shows error message when unauthenticated', function (assert) {
  nonExistentRepoPage.visit();

  andThen(function () {
    assert.equal(currentURL(), '/non-existent/repository');
    assert.ok(nonExistentRepoPage.showsTravisImage, 'Shows image for aesthetics');
    assert.equal(nonExistentRepoPage.errorMessage, 'The repository at non-existent/repository was not found.', 'Shows message that repository was not found');
  });
});
