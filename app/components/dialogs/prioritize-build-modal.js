import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import eventually from 'travis/utils/eventually';
import { reads, or, not } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';

export default Component.extend({
  keyboardShortcuts: {
    'esc': 'toggleCloseModal'
  },

  flashes: service(),

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  shouldCancelRunningJobs: true,

  item: or('job.build', 'build'),

  increasePriorityTask: task(function* () {
    // this.set('isLoading', true);
    yield eventually(this.item, (record) => {
      record.increasePriority(this.shouldCancelRunningJobs).then(() => {
        this.flashes.success('The build was successfully prioritized.');
        // this.set('isLoading', false);
        this.set('isOpen', false);
      }, () => {
        this.flashes.error('An error occurred. The build could not be prioritized.');
      });
    });
  }).drop(),

  actions: {
    toggleCloseModal() {
      if (!this.isLoading) {
        this.set('isOpen', false);
      }
    },
  }
});
