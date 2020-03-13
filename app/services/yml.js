import Service, { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Service.extend({
  ajax: service(),
  auth: service(),
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
    try {
      return yield this.store.queryRecord('request-config', { id: id, data });
    } catch (e) {
      this.handleLoadConfigError(e);
    }
  }).restartable(),

  handleLoadConfigError(e) {
    if (e.json) {
      e.json().then(e => {
        this.set('errorMessages', [{ level: 'error', code: e.error_type, args: { message: e.error_message } }]);
      });
    }
  },
});
