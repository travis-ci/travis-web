import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';

module('Unit | Controller | profile', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:profile');
    assert.ok(controller);
  });

  test('it handles routing properly', function (assert) {
    const controller = this.owner.lookup('controller:profile');
    const router = EmberObject.create({
      currentRouteName: ''
    });
    controller.setProperties({ router });

    router.set('currentRouteName', 'account.settings');
    assert.equal(controller.get('showLoading'), false);
    assert.equal(controller.get('showProfile'), true);

    router.set('currentRouteName', 'account_loading');
    assert.equal(controller.get('showLoading'), true);
    assert.equal(controller.get('showProfile'), true);

    router.set('currentRouteName', 'profile_loading');
    assert.equal(controller.get('showLoading'), true);
    assert.equal(controller.get('showProfile'), true);

    router.set('currentRouteName', 'account.settings.unsubscribe');
    assert.equal(controller.get('showLoading'), false);
    assert.equal(controller.get('showProfile'), false);
  });
});
