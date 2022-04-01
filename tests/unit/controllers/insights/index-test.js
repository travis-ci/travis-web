import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | insights/index', function (hooks) {
  setupTest(hooks);


  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:insights/index');
    assert.ok(controller);
  });
});
