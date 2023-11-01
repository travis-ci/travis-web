import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import Polling from 'travis/services/polling';
import config from 'travis/config/environment';
import { Promise } from 'rsvp';

import { module, test } from 'qunit';

let service;

module('PollingService', function (hooks) {
  hooks.beforeEach(function () {
    return config.ajaxPolling = true;
  });

  hooks.afterEach(function () {
    config.ajaxPolling = false;
    if (!service.get('isDestroyed')) {
      return run(function () {
        return service.destroy();
      });
    }
  });

  test('polls for each of the models', function (assert) {
    const done = assert.async();
    assert.expect(3);
    const history = [];
    service = Polling.create({
      pollingInterval: 20
    });
    const model1 = {
      reload: function () {
        assert.ok(true);
        return history.push('model1');
      }
    };
    const model2 = {
      reload: function () {
        assert.ok(true);
        return history.push('model2');
      }
    };
    service.startPolling(model1);
    service.startPolling(model2);
    return setTimeout(function () {
      assert.deepEqual(history, ['model1', 'model2']);
      run(function () {
        return service.destroy();
      });
      done();
    }, 30);
  });

  test('it will stop running any reloads after it is destroyed', function (assert) {
    assert.expect(1);
    const done = assert.async();
    service = Polling.create({
      pollingInterval: 20
    });
    const model = {
      reload: function () {
        return assert.ok(true);
      }
    };
    service.startPolling(model);
    setTimeout(function () {
      return run(function () {
        return service.destroy();
      });
    }, 30);
    return setTimeout(function () {
      done();
    }, 50);
  });

  test('it stops reloading models after they were removed from polling', async function (assert) {
    assert.expect(4);

    let done;
    let pollingComplete = new Promise(resolve => {
      done = resolve;
    });

    let count = 0;
    const history = [];
    service = Polling.create({
      pollingInterval: 1
    });
    const model1 = {
      reload: function () {
        count++;
        assert.ok(true, `model1 reloaded ${count}x`);
        if (count === 2) {
          service.stopPolling(model1);
          done();
        }
        return history.push('model1');
      }
    };
    const model2 = {
      reload: function () {
        assert.ok(true, 'model2 reloaded');
        service.stopPolling(model2);
        return history.push('model2');
      }
    };
    service.startPolling(model1);
    service.startPolling(model2);

    await pollingComplete;

    run(service, 'destroy');
    assert.deepEqual(history, ['model1', 'model2', 'model1']);
  });

  test('it runs a hook on each interval', function (assert) {
    assert.expect(1);
    const done = assert.async();
    service = Polling.create({
      pollingInterval: 20
    });
    const source = {
      pollHook: function () {
        return assert.ok(true);
      }
    };
    service.startPollingHook(source);
    return setTimeout(function () {
      service.stopPollingHook(source);
      return setTimeout(function () {
        run(function () {
          return service.destroy();
        });
        done();
      }, 10);
    }, 30);
  });

  test('it will not run pollHook if the source is destroyed', function (assert) {
    assert.expect(1);
    const done = assert.async();
    service = Polling.create({
      pollingInterval: 20
    });
    const source = EmberObject.extend({
      pollHook: function () {
        return assert.ok(true);
      }
    }).create();
    service.startPollingHook(source);
    return setTimeout(function () {
      run(function () {
        return source.destroy();
      });
      return setTimeout(function () {
        run(function () {
          return service.destroy();
        });
        done();
      }, 35);
    }, 30);
  });
});
