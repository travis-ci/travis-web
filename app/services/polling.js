import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Service.extend({
  pollingInterval: 30000,
  ajaxPolling: true,

  init() {
    let interval;
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
    this._super(...arguments);
    let interval = this.get('interval');
    if (interval) {
      return clearInterval(interval);
    }
  },

  startPollingHook(source) {
    let sources;
    sources = this.get('sources');
    if (!sources.contains(source)) {
      return sources.pushObject(source);
    }
  },

  stopPollingHook(source) {
    let sources;
    sources = this.get('sources');
    return sources.removeObject(source);
  },

  startPolling(model) {
    let watchedModels;
    watchedModels = this.get('watchedModels');
    if (!watchedModels.contains(model)) {
      return watchedModels.pushObject(model);
    }
  },

  stopPolling(model) {
    let watchedModels;
    watchedModels = this.get('watchedModels');
    return watchedModels.removeObject(model);
  },

  poll() {
    this.get('watchedModels').forEach(model => model.reload());

    return this.get('sources').forEach((source) => {
      if (Ember.get(source, 'isDestroyed')) {
        return this.get('sources').removeObject(source);
      } else {
        return source.pollHook();
      }
    });
  }
});
