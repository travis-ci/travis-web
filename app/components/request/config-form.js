import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { reads } from '@ember/object/computed';
import BranchSearching from 'travis/mixins/branch-searching';
import { bindKeyboardShortcuts, unbindKeyboardShortcuts } from 'ember-keyboard-shortcuts';

const CONFIG = {
  SOURCE: {
    API: 'api'
  },
  JAVASCRIPT: 'javascript',
  YAML: 'yaml',
};

export default Component.extend(BranchSearching, {
  classNames: ['request-configs-form'],

  repo: reads('request.repo'),
  requestConfig: reads('preview.requestConfig'),

  rawConfigs: computed('preview.rawConfigs', function () {
    const configs = this.preview.rawConfigs;
    if (configs) {
      return configs.reject(config => config.source.slice(0, 3) == CONFIG.SOURCE.API);
    }
  }),

  keyboardShortcuts: {
    'shift+enter': 'submit'
  },

  onChange() {},
  onSubmit() {},

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  searchBranches: task(function* (query) {
    const result = yield this.searchBranch.perform(this.get('repo.id'), query);
    return result.mapBy('name');
  }),

  configMode: computed('config', function () {
    const { config } = this;
    const { JAVASCRIPT, YAML } = CONFIG;
    return config && config.startsWith('{') ? JAVASCRIPT : YAML;
  }),

  configs: computed('request.uniqRawConfigs', 'config', function () {
    const { SOURCE } = CONFIG;
    let configs = this.get('request.uniqRawConfigs') || [];
    configs = configs.reject(config => config.source === SOURCE.API);
    if (this.config) {
      configs.unshift({ config: this.config, source: SOURCE.API });
    }
    return configs;
  }),

  actions: {
    change(field, value) {
      this.onChange(field, value);
    },

    submit() {
      this.onSubmit();
    }
  }
});
