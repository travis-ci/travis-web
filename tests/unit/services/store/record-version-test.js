import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Store | record version management', function(hooks) {
  setupTest(hooks);

  test('it does not allow to push an older record to the store', function (assert) {
    assert.expect(2);
    let store = this.owner.lookup('service:store'),
      transform = this.owner.lookup('transform:date');

    run(() => {
      store.push({
        data: {
          id: 1,
          type: 'build',
          attributes: {
            number: '1',
            state: 'started',
            updatedAt: transform.deserialize('2017-11-11T12:00:00.100Z')
          }
        }
      });
    });

    let result = store.peekRecord('build', '1');

    assert.equal(result.get('state'), 'started');

    // let's push an older version of the build
    run(() => {
      store.push({
        data: {
          id: 1,
          type: 'build',
          attributes: {
            number: '1',
            state: 'created',
            updatedAt: transform.deserialize('2017-11-11T12:00:00.000Z')
          }
        }
      });
    });

    result = store.peekRecord('build', '1');

    assert.equal(result.get('state'), 'started');
  });

  test('it does not allow to push an older record to the store even if it is not the main record', function (assert) {
    assert.expect(5);
    let store = this.owner.lookup('service:store'),
      transform = this.owner.lookup('transform:date');

    run(() => {
      store.push({
        data: {
          id: 1,
          type: 'build',
          attributes: {
            number: '1',
            state: 'started',
            updatedAt: transform.deserialize('2017-11-11T12:00:00.000Z')
          },
        },

        included: [{
          id: 1,
          type: 'job',
          attributes: {
            number: '1.1',
            state: 'started',
            updatedAt: transform.deserialize('2017-11-11T12:00:00.100Z')
          }
        }]
      });
    });

    let build = store.peekRecord('build', '1');
    assert.equal(build.get('state'), 'started');

    let job = store.peekRecord('job', '1');
    assert.equal(job.get('state'), 'started');

    // let's push a newer build with an older job
    run(() => {
      store.push({
        data: {
          id: 1,
          type: 'build',
          attributes: {
            number: '2',
            state: 'started',
            updatedAt: transform.deserialize('2017-11-11T12:00:00.100Z')
          },
        },

        included: [{
          id: 1,
          type: 'job',
          attributes: {
            number: '1.1',
            state: 'created',
            updatedAt: transform.deserialize('2017-11-11T12:00:00.000Z')
          }
        }]
      });
    });

    build = store.peekRecord('build', '1');
    assert.equal(build.get('state'), 'started');
    assert.equal(build.get('number'), '2');

    job = store.peekRecord('job', '1');
    assert.equal(job.get('state'), 'started');
  });
});