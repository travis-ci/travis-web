import { module, test } from 'qunit';
import { setupApplicationTest } from 'travis/tests/helpers/setup-application-test';
import config from 'travis/config/environment';

module('Acceptance | config/oss feature flags', function (hooks) {
  setupApplicationTest(hooks);

  test('configures feature flags', function (assert) {
    const { featureFlags } = config;
    assert.equal(featureFlags['repository-filtering'], true);
    assert.equal(featureFlags['debug-logging'], false);
    assert.equal(featureFlags['landing-page-cta'], true);
    assert.equal(featureFlags['show-running-jobs-in-sidebar'], false);
    assert.equal(featureFlags['debug-builds'], false);
    assert.equal(featureFlags['broadcasts'], true);
    assert.equal(featureFlags['beta-features'], true);
  });
});
