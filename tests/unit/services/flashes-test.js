import { moduleFor, test } from 'ember-qunit';

moduleFor('service:flashes', 'Unit | Service | flashes', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it allows to show an error', function(assert) {
  let service = this.subject();

  assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

  service.error('There was an error!');

  assert.deepEqual(service.get('flashes.firstObject'), { message: 'There was an error!', type: 'error' }, 'there should be an error message in flashes');
});

test('it allows to show an notice', function(assert) {
  let service = this.subject();

  assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

  service.notice('There was an notice!');

  assert.deepEqual(service.get('flashes.firstObject'), { message: 'There was an notice!', type: 'notice' }, 'there should be an notice message in flashes');
});

test('it allows to show an warning', function(assert) {
  let service = this.subject();

  assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

  service.warning('There was an warning!');

  assert.deepEqual(service.get('flashes.firstObject'), { message: 'There was an warning!', type: 'warning' }, 'there should be an warning message in flashes');
});

