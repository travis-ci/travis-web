import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';
import config from 'travis/config/environment';

import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | enterprise/trial-banner', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);

    server.get(`${config.replicatedApiEndpoint}/license/v1/license`, (schema, request) => {
      return {
        'license_type': this.licenseType || 'trial',
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
    percySnapshot(assert);
  });
});

test('when the trial expires in two days', function (assert) {
  withFeature('enterpriseVersion');
  this.expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isVisible);
    assert.equal(topPage.enterpriseTrialBanner.text, 'Your trial license expires 2 days from now.');
  });
  percySnapshot(assert);
});

test('when the trial expires tomorrow', function (assert) {
  withFeature('enterpriseVersion');
  this.expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isVisible);
    assert.equal(topPage.enterpriseTrialBanner.text, 'Your trial license expires about 24 hours from now.');
  });
});

test('when it’s not a trial as indicated by the license_type attribute', function (assert) {
  withFeature('enterpriseVersion');
  server.get(`${config.replicatedApiEndpoint}/license/v1/license`, (schema, request) => {
    return {
      'license_type': 'something',
      'expiration_time': this.expirationTime
    };
  });

  this.expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 22);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isHidden);
  });
});

test('when it’s not a trial as indicated by presence of a billing_frequency attribute', function (assert) {
  withFeature('enterpriseVersion');
  server.get(`${config.replicatedApiEndpoint}/license/v1/license`, (schema, request) => {
    return {
      'billing_frequency': 'something',
      'expiration_time': this.expirationTime
    };
  });

  this.expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 22);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isHidden);
  });
});

test('when it’s not a trial and the expiration date is more than 21 days away', function (assert) {
  withFeature('enterpriseVersion');
  this.expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 22);
  this.licenseType = 'a non-trial license type';
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isHidden);
  });
});

test('when it’s not a trial but the expiration date is less than 21 days away', function (assert) {
  withFeature('enterpriseVersion');
  this.expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 19);
  this.licenseType = 'a non-trial license type';
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isVisible);
    assert.equal(topPage.enterpriseTrialBanner.text, 'Your license expires 19 days from now, please contact enterprise@travis-ci.com');
    percySnapshot(assert);
  });
});

test('when it’s not an enterprise installation', function (assert) {
  this.expirationTime = new Date(new Date().getTime() + 10000000);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isHidden);
  });
});
