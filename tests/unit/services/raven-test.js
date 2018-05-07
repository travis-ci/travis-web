import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import config from 'travis/config/environment';

module('Unit | Service | raven', function (hooks) {
  setupTest(hooks);

  test('it filters benign errors', function (assert) {
    let service = this.owner.lookup('service:raven');
    let filteredError = { message: 'foo is an error we should filter' };
    let unfilteredError = { message: 'throw' };

    service.shouldReportError = () => true;
    service.set('benignErrors', ['foo', 'bar', 'baz']);

    assert.ok(service.ignoreError(filteredError), 'Service should ignore benign error');
    assert.notOk(service.ignoreError(unfilteredError), 'Service should not ignore serious error');
  });

  test('it skips sampling when requested', function (assert) {
    let service = this.owner.lookup('service:raven');
    let sampledError = { message: 'this error should not be reported due to sampling' };
    let forcedReportingError = { message: 'this error will be reported despite sampling' };

    service.sampleError = () => false;

    config.sentry.development = false;

    assert.ok(service.ignoreError(sampledError), 'Service should ignore error when not sampled');
    assert.notOk(service.ignoreError(forcedReportingError, true), 'Service should not ignore error when sampling is forced');

    config.sentry.development = true;
  });
});
