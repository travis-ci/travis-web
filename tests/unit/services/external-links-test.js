import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | external-links', function (hooks) {
  setupTest(hooks);

  test('email', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const email = 'builder@travis-ci.com';
    assert.equal(service.email(email), 'mailto:builder@travis-ci.com');
  });

  test('travisWebBranch', function (assert) {
    const service = this.owner.lookup('service:external-links');
    const branchName = 'bd-no-justice-no-peace';

    assert.equal(service.travisWebBranch(branchName), 'https://github.com/travis-ci/travis-web/tree/bd-no-justice-no-peace');
  });

  test('billingUrl as organization', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.billingUrl('organization', 'travis-ci'), 'https://billing.travis-ci.com/subscriptions/travis-ci');
  });

  test('billingUrl as user', function (assert) {
    const service = this.owner.lookup('service:external-links');
    assert.equal(service.billingUrl('user', 'travis-ci'), 'https://billing.travis-ci.com/subscriptions/user');
  });
});
