import Ember from 'ember';
import Polling from 'travis/services/polling';
import config from 'travis/config/environment';

let service;

module('PollingService', {
  setup() {
    return config.ajaxPolling = true;
  },
  teardown() {
    config.ajaxPolling = false;
    if (!service.get('isDestroyed')) {
      return Ember.run(() => service.destroy());
    }
  }
});

test('polls for each of the models', () => {
  let history, model1, model2;
  expect(3);
  history = [];
  service = Polling.create({
    pollingInterval: 20
  });
  model1 = {
    reload() {
      ok(true);
      return history.push('model1');
    }
  };
  model2 = {
    reload() {
      ok(true);
      return history.push('model2');
    }
  };
  service.startPolling(model1);
  service.startPolling(model2);
  stop();
  return setTimeout(() => {
    start();
    deepEqual(history, ['model1', 'model2']);
    return Ember.run(() => service.destroy());
  }, 30);
});

test('it will stop running any reloads after it is destroyed', () => {
  let model;
  expect(1);
  service = Polling.create({
    pollingInterval: 20
  });
  model = {
    reload() {
      return ok(true);
    }
  };
  service.startPolling(model);
  stop();
  setTimeout(() => Ember.run(() => service.destroy()), 30);
  return setTimeout(() => start(), 50);
});

test('it stops reloading models after they were removed from polling', () => {
  let history, model1, model2;
  expect(4);
  history = [];
  service = Polling.create({
    pollingInterval: 30
  });
  model1 = {
    reload() {
      ok(true);
      return history.push('model1');
    }
  };
  model2 = {
    reload() {
      ok(true);
      return history.push('model2');
    }
  };
  service.startPolling(model1);
  service.startPolling(model2);
  stop();
  return setTimeout(() => {
    service.stopPolling(model2);
    return setTimeout(() => {
      Ember.run(() => service.destroy());
      start();
      return deepEqual(history, ['model1', 'model2', 'model1']);
    }, 30);
  }, 40);
});

test('it runs a hook on each interval', () => {
  let source;
  expect(1);
  service = Polling.create({
    pollingInterval: 20
  });
  source = {
    pollHook() {
      return ok(true);
    }
  };
  service.startPollingHook(source);
  stop();
  return setTimeout(() => {
    service.stopPollingHook(source);
    return setTimeout(() => {
      Ember.run(() => service.destroy());
      return start();
    }, 10);
  }, 30);
});

test('it will not run pollHook if the source is destroyed', () => {
  let source;
  expect(1);
  service = Polling.create({
    pollingInterval: 20
  });
  source = Ember.Object.extend({
    pollHook() {
      return ok(true);
    }
  }).create();
  service.startPollingHook(source);
  stop();
  return setTimeout(() => {
    Ember.run(() => source.destroy());
    return setTimeout(() => {
      Ember.run(() => service.destroy());
      return start();
    }, 35);
  }, 30);
});
