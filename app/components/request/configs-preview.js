import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'div',
  classNames: ['request-configs-preview', 'status'],

  yml: service(),

  rawConfigs: or('yml.rawConfigs', 'request.uniqRawConfigs'),
  messages: reads('yml.messages'),
  loading: reads('yml.loading'),
  matrix: reads('yml.matrix'),
  merged: reads('yml.config'),
  repo: reads('request.repo'),

  formattedConfig: computed('merged', function () {
    return JSON.stringify(this.merged, null, 2);
  }),

  formattedMatrix: computed('matrix', function () {
    return JSON.stringify(this.matrix, null, 2);
  }),

  getConfigsData() {
    return {
      repo: {
        slug: this.repo.get('slug'),
        private: this.repo.get('private'),
        default_branch: this.repo.get('defaultBranch.name'),
      },
      ref: this.ref,
      mode: this.mergeMode,
      config: this.config,
      type: 'api'
    };
  },

  didInsertElement() {
    let data = this.getConfigsData();
    this.yml.loadConfigs.perform(data);
  },
});
