import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Service.extend({
  pollingInterval: 30000,
  ajaxPolling: true,

  init() {
    var interval;
    this._super(...arguments);
    this.set('watchedModels', []);
    this.set('sources', []);

    interval = setInterval(() => {
      if (config.ajaxPolling) {
        this.poll();
      }
    }, this.get('pollingInterval'));

    this.set('interval', interval);
  },

  willDestroy() {
    var interval;
    this._super(...arguments);
    if (interval = this.get('interval')) {
      return clearInterval(interval);
    }
  },

  startPollingHook(source) {
    var sources;
    sources = this.get('sources');
    if (!sources.contains(source)) {
      return sources.pushObject(source);
    }
  },

  stopPollingHook(source) {
    var sources;
    sources = this.get('sources');
    return sources.removeObject(source);
  },

  startPolling(model) {
    var watchedModels;
    watchedModels = this.get('watchedModels');
    if (!watchedModels.contains(model)) {
      return watchedModels.pushObject(model);
    }
  },

  stopPolling(model) {
    var watchedModels;
    watchedModels = this.get('watchedModels');
    return watchedModels.removeObject(model);
  },

  poll() {
    this.get('watchedModels').forEach(function(model) {
      return model.reload();
    });

    return this.get('sources').forEach( (source) => {
     if (Ember.get(source, 'isDestroyed')) {
       return this.get('sources').removeObject(source);
     } else {
       return source.pollHook();
     }
    });
  }
});
