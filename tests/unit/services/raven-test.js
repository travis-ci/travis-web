import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | raven', function (hooks) {
  setupTest(hooks);

  test('it filters benign errors', function (assert) {
    let service = this.owner.lookup('service:raven');
    let filteredError = { message: 'foo is an error we should filter' };
    let unfilteredError = { message: 'throw dat' };

    service.shouldReportError = () => true;
    service.set('benignErrors', ['foo', 'bar', 'baz']);

    assert.ok(service.ignoreError(filteredError), 'Service should ignore benign error');
    assert.notOk(service.ignoreError(unfilteredError), 'Service should not ignore serious error');
  });
});
