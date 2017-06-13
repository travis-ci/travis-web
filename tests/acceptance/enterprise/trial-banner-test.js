import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import config from 'travis/config/environment';

import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | enterprise/trial-banner', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);

    server.logging = true;
    server.get(`${config.replicatedApiEndpoint}/license/v1/license`, (schema, request) => {
      return {
        'expiration_time': this.expirationTime
      };
    });
  }
});

test('when the trial has expired', function (assert) {
  withFeature('enterpriseVersion');
  this.expirationTime = new Date(new Date().getTime() - 1000);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isVisible);
    assert.equal(topPage.enterpriseTrialBanner.text, 'Your trial license has expired, please contact enterprise@travis-ci.com');
  });
});

test('when the trial has not expired', function (assert) {
  withFeature('enterpriseVersion');
  this.expirationTime = new Date(new Date().getTime() + 10000000);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isVisible);
    assert.equal(topPage.enterpriseTrialBanner.text, 'Your trial has not expired.');
  });
});

test('when it’s not an enterprise installation', function (assert) {
  this.expirationTime = new Date(new Date().getTime() + 10000000);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isHidden);
  });
});
