import Service, { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Service.extend({
  ajax: service(),
  store: service(),

  loading: reads('loadConfigs.isRunning'),
  loadConfigsResult: reads('loadConfigs.last.value'),
  rawConfigs: reads('loadConfigsResult.rawConfigs'),
  matrix: reads('loadConfigsResult.matrix'),
  config: reads('loadConfigsResult.config'),
  errorMessages: computed(() => []),
  messages: or('loadConfigsResult.messages', 'errorMessages'),

  loadConfigs: task(function* (data, debounce) {
    if (debounce && debounce.milliseconds) {
      yield timeout(debounce.milliseconds);
    }
    try {
      return yield this.store.queryRecord('build-config', { data });
    } catch (e) {
      this.handleLoadConfigError(e);
    }
  }).drop(),

  handleLoadConfigError(e) {
    if (e.json) {
      e.json().then(e => {
        this.set('errorMessages', [{ level: 'error', code: e.error_type, args: { message: e.error_message } }]);
      });
    }
  },

  parse(configs) {
    return this.request('/parse', 'POST', {
      data: this.normalize(configs),
      contentType: 'application/vnd.travis-ci.configs+json'
    });
  },

  expand(config) {
    return this.request('/expand', 'POST', {
      data: { config: config }
    });
  },

  request(url, method = 'GET', options = {}) {
    options.host = config.ymlEndpoint;
    options.headers = this.headers(options);
    return this.ajax.request(url, method, options);
  },

  headers(options = {}) {
    const { headers = {} } = options;
    headers['Authorization'] = 'Basic eDpqZm5DcWJKbGJ2eFpsWDQwdUUwREtn'; // TODO
    return headers;
  },

  normalize(configs) {
    return configs.map(config => {
      if (config.source == 'api') {
        config.config = config.config.replace(/\t/gm, '  ');
      }
      return config;
    });
  },
});
