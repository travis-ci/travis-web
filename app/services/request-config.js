import Service, { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Service.extend({
  store: service(),

  loaded: false,
  loading: reads('loadConfigs.isRunning'),
  rawConfigs: reads('result.rawConfigs'),
  requestConfig: reads('result.requestConfig'),
  jobConfigs: reads('result.jobConfigs'),
  errorMessages: computed(() => []),
  messages: or('result.messages', 'errorMessages'),

  loadConfigs: task(function* (id, data, debounce) {
    if (debounce) {
      const { searchDebounceRate } = config.intervals;
      yield timeout(searchDebounceRate);
    }

    try {
      const result = yield this.store.queryRecord('request-config', { id, data });
      this.setProperties({ result, loaded: true });
    } catch (e) {
      // TODO for some reason this still logs the 400 request as an error to the console
      this.handleLoadConfigError(e);
    }
  }).restartable(),

  handleLoadConfigError(e) {
    const error = e.errors[0];
    const msg = { level: 'error', code: error.title, args: { message: error.detail } };
    this.set('result', null);
    this.set('errorMessages', [msg]);
  },

  reset() {
    this.set('loaded', false);
  }
});
