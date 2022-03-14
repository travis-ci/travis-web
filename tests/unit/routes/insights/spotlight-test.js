import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | insights/spotlight', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:insights/spotlight');
    assert.ok(route);
  });
});
