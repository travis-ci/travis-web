import Service, { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Service.extend({
  store: service(),

  loading: reads('loadConfigs.isRunning'),
  loadConfigsResult: reads('loadConfigs.last.value'),
  rawConfigs: reads('loadConfigsResult.rawConfigs'),
  requestConfig: reads('loadConfigsResult.requestConfig'),
  jobConfigs: reads('loadConfigsResult.jobConfigs'),
  errorMessages: computed(() => []),
  messages: or('loadConfigsResult.messages', 'errorMessages'),

  loadConfigs: task(function* (id, data, debounce) {
    if (debounce) {
      const { searchDebounceRate } = config.intervals;
      yield timeout(searchDebounceRate);
    }

    return yield this.store.queryRecord('request-config', { id, data }).catch((e) => {
      // TODO for some reason this still logs the 400 request as an error to the console
      this.handleLoadConfigError(e);
    });
  }).restartable(),

  handleLoadConfigError(e) {
    let error = e.errors[0];
    let msg = { level: 'error', code: error.title, args: { message: error.detail } };
    this.set('errorMessages', [msg]);
  },
});
