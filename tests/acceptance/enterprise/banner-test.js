import { test } from 'qunit';
import moduleForAcceptance from 'travis/tests/helpers/module-for-acceptance';

import topPage from 'travis/tests/pages/top';

moduleForAcceptance('Acceptance | enterprise/trial-banner', {
  beforeEach() {
    const currentUser = server.create('user');
    signInUser(currentUser);

    server.get('/enterprise_license', (schema, request) => {
      return {
        'license_id': 'ad12345',
        'seats': '30',
        'active_users': '21',
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
  server.get('/enterprise_license', (schema, request) => {
    return {
      'license_type': 'paid',
      'expiration_time': this.expirationTime
    };
  });

  this.expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 22);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isHidden);
  });
});

// test('when it’s not a trial as indicated by presence of a billing_frequency attribute', function (assert) {
//   withFeature('enterpriseVersion');
//   server.get('/enterprise_license', (schema, request) => {
//     return {
//       'billing_frequency': 'something',
//       'expiration_time': this.expirationTime
//     };
//   });
//
//   this.expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 22);
//   visit('/');

//   andThen(function () {
//     assert.ok(topPage.enterpriseTrialBanner.isHidden);
//   });
// });

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
  });
});

test('when used seats are exeeding the amount listed in license', function (assert) {
  withFeature('enterpriseVersion');
  visit('/');
  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isVisible);
    assert.equal(topPage.enterpriseTrialBanner.text, 'You’re approaching the maximum seats that your license permits, please contact enterprise@travis-ci.com if you need more seats.');
  });
});

test('when it’s not an enterprise installation', function (assert) {
  this.expirationTime = new Date(new Date().getTime() + 10000000);
  visit('/');

  andThen(function () {
    assert.ok(topPage.enterpriseTrialBanner.isHidden);
  });
});
