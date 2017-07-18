import { moduleFor, test } from 'ember-qunit';

moduleFor('service:flashes', 'Unit | Service | flashes', {
  needs: ['service:auth']
});

// FIXME is this ridiculous…? 🤔

function subsetFlashObject(o) {
  return {
    message: o.message,
    type: o.type
  };
}

test('it allows to show an error', function (assert) {
  let service = this.subject();

  assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

  service.error('There was an error!');

  assert.deepEqual(subsetFlashObject(service.get('flashes.firstObject')), { message: 'There was an error!', type: 'error' }, 'there should be an error message in flashes');
});

test('it allows to show a notice', function (assert) {
  let service = this.subject();

  assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

  service.notice('There was a notice!');

  assert.deepEqual(subsetFlashObject(service.get('flashes.firstObject')), { message: 'There was a notice!', type: 'notice' }, 'there should be a notice message in flashes');
});

test('it allows to show a success', function (assert) {
  let service = this.subject();

  assert.equal(service.get('flashes.length'), 0, 'precond - flashes initializes with 0 elements');

  service.success('There was a success!');

  assert.deepEqual(subsetFlashObject(service.get('flashes.firstObject')), { message: 'There was a success!', type: 'success' }, 'there should be a notice message in flashes');
});
