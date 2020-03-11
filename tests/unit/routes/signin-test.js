import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | signin', function (hooks) {
  setupTest(hooks);

  test('it does not require auth', function (assert) {
    let route = this.owner.lookup('route:signin');
    assert.ok(!route.get('needsAuth'));
  });
});
