import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | travis-ci-insights', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:travis-ci-insights');
    assert.ok(route);
  });
});
