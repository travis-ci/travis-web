import { Promise as EmberPromise } from 'rsvp';
import { run } from '@ember/runloop';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('job', 'Unit | Model | job', {
  needs: ['model:repo', 'model:build', 'model:commit', 'model:stage', 'service:ajax',
    'service:jobConfigFetcher', 'service:auth', 'service:features', 'service:flashes',
    'service:storage', 'service:sessionStorage']
});

test('config is fetched if it\'s not available', function (assert) {
  assert.expect(2);
  let done = assert.async();

  const model = this.subject();

  model.get('jobConfigFetcher').fetch = function (job) {
    assert.equal(job.get('id'), model.id);
    return EmberPromise.resolve({ foo: 'bar' });
  };

  model.get('config').then(config => assert.equal(config.foo, 'bar'));

  setTimeout(function () {
    done();
  }, 100);
});

test('created state', function (assert) {
  const model = this.subject();
  run(function () {
    return model.setProperties({
      state: 'created'
    });
  });
  assert.equal(model.get('isFinished'), false, 'queued state is not finished');
  assert.equal(model.get('toBeQueued'), true, 'queued state is to be queued');
  assert.equal(model.get('toBeStarted'), false, 'queued state is not to be started');
  assert.equal(model.get('notStarted'), true, 'queued state has not started');
});

test('queued state', function (assert) {
  const model = this.subject();
  run(function () {
    return model.setProperties({
      state: 'queued'
    });
  });
  assert.equal(model.get('isFinished'), false, 'queued state is not finished');
  assert.equal(model.get('toBeQueued'),  false, 'queued state is not to be queued');
  assert.equal(model.get('toBeStarted'), true, 'queued state is to be started');
  assert.equal(model.get('notStarted'), true, 'queued state has not started');
});
