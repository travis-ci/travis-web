import { moduleFor, test } from 'ember-qunit';

moduleFor('service:raven', 'Unit | Service | raven', {
});

test('it filters errors matching whitelist', function(assert) {
  let service = this.subject();
  let filteredError = { message: 'foo is an error we should filter' };
  let unfilteredError = { message: 'throw dat' };

  service.shouldReportError = () => true;
  service.set('whitelistMessages', ['foo', 'bar', 'baz']);

  assert.ok(service.ignoreError(filteredError), "Service should ignore whitelisted error");
  assert.notOk(service.ignoreError(unfilteredError), "Service should not ignore non-whitelisted error");
});
