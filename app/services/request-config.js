import Service, { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Service.extend({
  store: service(),

  loaded: false,
  loading: reads('loadConfigs.isRunning'),
  rawConfigs: reads('record.rawConfigs'),
  requestConfig: reads('record.requestConfig'),
  jobConfigs: reads('record.jobConfigs'),
  errorMessages: computed(() => []),
  messages: or('record.messages', 'errorMessages'),

  loadConfigs: task(function* (data, debounce) {
    if (debounce) {
      const { searchDebounceRate } = config.intervals;
      yield timeout(searchDebounceRate);
    }

    try {
      data.repo = yield this.store.findRecord('repo', data.repo.get('id'));
      const record = this.store.createRecord('request-config', data);
      yield record.save();
      this.setProperties({ record: record, loaded: true });
    } catch (e) {
      // TODO for some reason this still logs the 400 request as an error to the console
      this.handleLoadConfigError(e);
    }
  }).restartable(),

  handleLoadConfigError(e) {
    console.log(e);
    // const error = e.errors[0];
    // const msg = { level: 'error', code: error.title, args: { message: error.detail } };
    // this.set('record', null);
    // this.set('errorMessages', [msg]);
  },

  reset() {
    this.set('loaded', false);
  }
});
