import { get } from '@ember/object';
import Service from '@ember/service';
import config from 'travis/config/environment';

export default Service.extend({
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
    }, this.pollingInterval);

    this.set('interval', interval);
  },

  willDestroy() {
    this._super(...arguments);
    let interval = this.interval;
    if (interval) {
      return clearInterval(interval);
    }
  },

  startPollingHook(source) {
    let sources;
    sources = this.sources;
    if (!sources.includes(source)) {
      return sources.pushObject(source);
    }
  },

  stopPollingHook(source) {
    let sources;
    sources = this.sources;
    return sources.removeObject(source);
  },

  startPolling(model) {
    let watchedModels;
    watchedModels = this.watchedModels;
    if (!watchedModels.includes(model)) {
      return watchedModels.pushObject(model);
    }
  },

  stopPolling(model) {
    let watchedModels;
    watchedModels = this.watchedModels;
    return watchedModels.removeObject(model);
  },

  poll() {
    this.watchedModels.forEach(model => model.reload());

    return this.sources.forEach((source) => {
      if (get(source, 'isDestroyed')) {
        return this.sources.removeObject(source);
      } else {
        return source.pollHook();
      }
    });
  }
});
