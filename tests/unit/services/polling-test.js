import Ember from 'ember';
import Polling from 'travis/services/polling';
import config from 'travis/config/environment';

const { module, test } = QUnit;

let service;

module('PollingService', {
  beforeEach() {
    return config.ajaxPolling = true;
  },
  afterEach() {
    config.ajaxPolling = false;
    if (!service.get('isDestroyed')) {
      return Ember.run(function () {
        return service.destroy();
      });
    }
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
    Ember.run(function () {
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
    return Ember.run(function () {
      return service.destroy();
    });
  }, 30);
  return setTimeout(function () {
    done();
  }, 50);
});

test('it stops reloading models after they were removed from polling', function (assert) {
  assert.expect(4);
  const done = assert.async();
  const history = [];
  service = Polling.create({
    pollingInterval: 30
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
    service.stopPolling(model2);
    return setTimeout(function () {
      Ember.run(function () {
        return service.destroy();
      });
      assert.deepEqual(history, ['model1', 'model2', 'model1']);
      done();
    }, 30);
  }, 40);
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
      Ember.run(function () {
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
  const source = Ember.Object.extend({
    pollHook: function () {
      return assert.ok(true);
    }
  }).create();
  service.startPollingHook(source);
  return setTimeout(function () {
    Ember.run(function () {
      return source.destroy();
    });
    return setTimeout(function () {
      Ember.run(function () {
        return service.destroy();
      });
      done();
    }, 35);
  }, 30);
});
