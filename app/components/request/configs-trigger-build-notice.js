import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, reads } from '@ember/object/computed';
import { STATUSES } from 'travis/components/request/configs';

export default Component.extend({
  tagName: '',

  configs: 1,
  view: null,
  build: null,
  customizing: equal('view', STATUSES.CUSTOMIZE),
  previewing: equal('view', STATUSES.PREVIEW),
  submitting: reads('build.submitting'),
  pending: reads('build.pending'),
  success: reads('build.success'),
  rejected: reads('build.rejected'),

  state: computed('submitting', 'pending', 'success', 'rejected', function () {
    if (this.submitting) {
      return 'submitting';
    } else if (this.pending) {
      return 'pending';
    } else if (this.success) {
      return 'success';
    } else if (this.rejected) {
      return 'rejected';
    }
  }),

  actions: {
    reset() {
      this.build.reset();
    }
  }
});
