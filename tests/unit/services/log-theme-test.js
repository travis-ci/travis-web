import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | log-theme', function(hooks) {
  setupTest(hooks);

  test('it sets default theme to dark', function(assert) {
    let service = this.owner.lookup('service:log-theme');
    assert.equal(service.theme, 'dark');
  });
});
