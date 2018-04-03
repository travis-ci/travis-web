import Application from '@ember/application';
import { run } from '@ember/runloop';
import { initialize } from 'travis/instance-initializers/enterprise-environment';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import EmberObject from '@ember/object';

module('Unit | Instance Initializer | enterprise environment', function (hooks) {
  hooks.beforeEach(function () {
    run(() => {
      this.application = Application.create();
      this.application.register('config:environment', EmberObject.create({ featureFlags: { 'enterprise-version': true }}));
      this.appInstance = this.application.buildInstance();
    });
  });

  hooks.afterEach(function () {
    run(this.appInstance, 'destroy');
    destroyApp(this.application);
  });

  test('it sets flags appropriately', function (assert) {
    initialize(this.appInstance);

    const { featureFlags } = this.appInstance.resolveRegistration('config:environment');

    assert.equal(featureFlags['repository-filtering'], true);
    assert.equal(featureFlags['debug-logging'], false);
    assert.equal(featureFlags['landing-page-cta'], false);
    assert.equal(featureFlags['show-running-jobs-in-sidebar'], false);
    assert.equal(featureFlags['debug-builds'], false);
    assert.equal(featureFlags['broadcasts'], false);
  });
});
