import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: 'div',
  classNames: ['request-configs-preview', 'status'],

  store: service(),
  loading: reads('load.isRunning'),

  repo: reads('request.repo'),

  formattedConfig: computed('merged', function () {
    return JSON.stringify(this.merged, null, 2);
  }),

  formattedMatrix: computed('matrix', function () {
    return JSON.stringify(this.matrix, null, 2);
  }),

  didInsertElement() {
    this.load.perform();
  },

  load: task(function* () {
    let data = {
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
    try {
      const result = yield this.store.queryRecord('build-config', { data });
      this.set('merged', result.config);
      this.set('messages', result.messages);
      this.set('matrix', result.matrix);
    } catch (e) {
      this.set('rawConfigs', []);
      this.set('messages', [{ level: 'error', code: e.error_type, args: { message: e.error_message } }]);
    }
  }).drop(),
});
