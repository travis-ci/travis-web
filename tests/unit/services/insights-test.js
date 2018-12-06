import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | insights', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.server.create('user');
  });

  // Replace this with your real tests.
  test('default interval settings', function (assert) {
    const service = this.owner.lookup('service:insights');
    const intervalSettings = service.getIntervalSettings({ day: {subInterval: '1min'} });
    const intervalSettings2 = service.getIntervalSettings();
    intervalSettings2.day.subInterval = '1min';

    assert.ok(service);
    assert.deepEqual(intervalSettings, intervalSettings2);
  });
});
