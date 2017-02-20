import { Promise as EmberPromise } from 'rsvp';
import { run } from '@ember/runloop';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('job', 'Unit | Model | job', {
  needs: ['model:repo', 'model:build', 'model:commit', 'model:stage', 'model:branch', 'service:ajax', 'service:jobConfigFetcher', 'service:auth', 'service:features', 'service:flashes']
});

test('config is fetched if it\'s not available', function (assert) {
  assert.expect(1);
  let done = assert.async();

  const model = this.subject();
  run(function () {
    return model.setProperties({
      _config: null
    });
  });

  let oldGetCurrentState = model.getCurrentState;
  model.getCurrentState = function () {
    return 'root.loading';
  };

  model.get('jobConfigFetcher').fetch = function (id) {
    assert.equal(id, model.id);
    return EmberPromise.resolve({});
  };

  model.get('config');

  setTimeout(function () {
    model.getCurrentState = oldGetCurrentState;
  }, 30);

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
