/* global define */
import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';
import Polling from 'travis/mixins/polling';

let hookRuns = 0, pollingChangesHistory = [];

define('travis/components/polling-test', [], () => {
  let PollingService;
  PollingService = Ember.Object.extend({
    startPolling(model) {
      return pollingChangesHistory.push({
        type: 'start',
        model
      });
    },
    stopPolling(model) {
      return pollingChangesHistory.push({
        type: 'stop',
        model
      });
    },
    startPollingHook(source) {
      return pollingChangesHistory.push({
        type: 'start-hook',
        source: `${source}`
      });
    },
    stopPollingHook(source) {
      return pollingChangesHistory.push({
        type: 'stop-hook',
        source: `${source}`
      });
    }
  });
  return Ember.Component.extend(Polling, {
    init() {
      this._super(...arguments);
      return this.set('polling', PollingService.create());
    },
    pollModels: ['model1', 'model2'],
    pollHook() {
      return hookRuns += 1;
    },
    toString() {
      return '<PollingTestingComponent>';
    }
  });
});

moduleForComponent('polling-test', 'PollingMixin', {
  needs: [],
  setup() {
    hookRuns = 0;
    return pollingChangesHistory = [];
  }
});

test('it properly stops polling hook without any models', function () {
  let component, expected;
  component = this.subject({
    pollModels: null
  });
  this.render();
  Ember.run(() => component.destroy());
  expected = [
    {
      type: 'start-hook',
      source: '<PollingTestingComponent>'
    }, {
      type: 'stop-hook',
      source: '<PollingTestingComponent>'
    }
  ];
  return deepEqual(pollingChangesHistory, expected);
});

test('it works even if one of the model is null', function () {
  let component, expected;
  component = this.subject({
    model1: {
      name: 'model1'
    }
  });
  this.render();
  Ember.run(() => component.destroy());
  expected = [
    {
      type: 'start',
      model: {
        name: 'model1'
      }
    }, {
      type: 'start-hook',
      source: '<PollingTestingComponent>'
    }, {
      type: 'stop',
      model: {
        name: 'model1'
      }
    }, {
      type: 'stop-hook',
      source: '<PollingTestingComponent>'
    }
  ];
  return deepEqual(pollingChangesHistory, expected);
});

test('it polls for both models if they are present', function () {
  let component, expected;
  component = this.subject({
    model1: {
      name: 'model1'
    },
    model2: {
      name: 'model2'
    }
  });
  this.render();
  Ember.run(() => component.destroy());
  expected = [
    {
      type: 'start',
      model: {
        name: 'model1'
      }
    }, {
      type: 'start',
      model: {
        name: 'model2'
      }
    }, {
      type: 'start-hook',
      source: '<PollingTestingComponent>'
    }, {
      type: 'stop',
      model: {
        name: 'model1'
      }
    }, {
      type: 'stop',
      model: {
        name: 'model2'
      }
    }, {
      type: 'stop-hook',
      source: '<PollingTestingComponent>'
    }
  ];
  return deepEqual(pollingChangesHistory, expected);
});

test('it detects model changes', function () {
  let component, expected;
  component = this.subject({
    model1: {
      name: 'foo'
    }
  });
  this.render();
  Ember.run(() => component.set('model1', {
    name: 'bar'
  }));
  Ember.run(() => component.destroy());
  expected = [
    {
      type: 'start',
      model: {
        name: 'foo'
      }
    }, {
      type: 'start-hook',
      source: '<PollingTestingComponent>'
    }, {
      type: 'stop',
      model: {
        name: 'foo'
      }
    }, {
      type: 'start',
      model: {
        name: 'bar'
      }
    }, {
      type: 'stop',
      model: {
        name: 'bar'
      }
    }, {
      type: 'stop-hook',
      source: '<PollingTestingComponent>'
    }
  ];
  return deepEqual(pollingChangesHistory, expected);
});
