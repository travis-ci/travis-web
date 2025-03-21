import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | flashes', function (hooks) {
  setupTest(hooks);

  // This strips the extra flash information (icon, close button presence, etc) and compares what matters.
  function subsetFlashObject(o) {
    return {
      message: o.message,
      type: o.type
    };
  }

  test('it allows to show an error', function (assert) {
    let service = this.owner.lookup('service:flashes');

    assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

    service.error('There was an error!');

    assert.deepEqual(subsetFlashObject(service.get('flashes.firstObject')), { message: 'There was an error!', type: 'error' }, 'there should be an error message in flashes');
  });

  test('it allows to show a warning', function (assert) {
    let service = this.owner.lookup('service:flashes');

    assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

    service.warning('There was a warning!');

    assert.deepEqual(subsetFlashObject(service.get('flashes.firstObject')), { message: 'There was a warning!', type: 'warning' }, 'there should be a warning message in flashes');
  });

  test('it allows to show a success', function (assert) {
    let service = this.owner.lookup('service:flashes');

    assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

    service.success('There was a success!');

    assert.deepEqual(subsetFlashObject(service.get('flashes.firstObject')), { message: 'There was a success!', type: 'success' }, 'there should be a notice message in flashes');
  });
});
