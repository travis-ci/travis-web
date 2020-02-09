import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, match } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'div',
  classNames: ['trigger-build-preview', 'status'],

  yml: service(),
  status: 'loading',
  loading: match('status', /loading/),

  repo: reads('request.repo'),

  formattedConfig: computed('merged', function () {
    return JSON.stringify(this.merged, null, 2);
  }),

  formattedMatrix: computed('matrix', function () {
    return JSON.stringify(this.matrix, null, 2);
  }),

  didInsertElement: function () {
    this.preview();
  },

  preview: function () {
    this.yml.configs(this.get('repo'), this.ref, this.mergeMode, this.config).then((data) => { // TODO error handling
      this.set('merged', data.config);
      this.set('messages', data.messages);
      this.set('matrix', data.matrix);
      this.set('status', 'done');
    });
  },
});
