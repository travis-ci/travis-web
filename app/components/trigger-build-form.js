import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  tagName: 'div',
  classNames: ['trigger-build'],

  searchBranches: task(function* (query) {
    const result = yield this.searchBranch.perform(this.get('repo.id'), query);
    return result.mapBy('name');
  }),

  configMode: computed('config', function () {
    if (this.config && this.config[0] == '{') {
      return 'javascript';
    } else {
      return 'yaml';
    }
  }),

  configType: computed('configMode', function () {
    if (this.configMode == 'javascript') {
      return 'JSON';
    } else {
      return 'YAML';
    }
  }),

  configs: computed('request.uniqRawConfigs', 'config', function () {
    let configs = this.get('request.uniqRawConfigs') || [];
    configs = configs.reject(config => config.source === 'api');
    if (this.config) {
      configs.unshift({ config: this.config, source: 'api' });
    }
    return configs;
  }),

  actions: {
    change: function (field, value) {
      this.set(field, value);
      this.onChange(field, value);
    }
  }
});
