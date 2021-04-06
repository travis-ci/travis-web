import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | request-email-confirmation', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:request-user-confirmation');
    assert.ok(route);
  });
});
