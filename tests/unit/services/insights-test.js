import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | insights', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.userData = this.server.create('user');
    // this.metricData = this.server.createList('insight-metric', 10);
    this.insightsService = this.owner.lookup('service:insights');
  });

  test('default interval settings', function (assert) {
    const intervalSettings = this.insightsService.getIntervalSettings({ day: {subInterval: '1min'} });
    const intervalSettings2 = this.insightsService.getIntervalSettings();
    intervalSettings2.day.subInterval = '1min';

    assert.ok(this.insightsService);
    assert.deepEqual(intervalSettings, intervalSettings2);
  });
});
