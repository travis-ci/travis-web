import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';

export default Component.extend({
  keyboardShortcuts: { 'esc': 'closeModal' },
  flashes: service(),
  shouldCancelRunningJobs: false,
  item: or('job.build', 'build'),

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  increasePriorityTask: task(function* () {
    try {
      const record = yield this.item;

      if (record.increasePriority) {
        yield record.increasePriority(this.shouldCancelRunningJobs);
        this.flashes.success('The build was successfully prioritized.');
        this.set('isOpen', false);

        const targetBuild = this.build || this.job.build;
        targetBuild.reload();
      }
    } catch (error) {
      this.flashes.error('An error occurred. The build could not be prioritized.');
    }
  }).drop(),

  actions: {
    closeModal() {
      if (!this.isLoading) {
        this.set('isOpen', false);
      }
    },
  }
});
