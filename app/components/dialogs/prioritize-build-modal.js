import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import eventually from 'travis/utils/eventually';
import { reads, or } from '@ember/object/computed';
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

  options: computed(() => {
    let arr = [
      {
        key: 'private1',
        displayValue: 'item1',
        cancelRunningJobsVal: false,
        description: 'Place build at the top of the queue',
        modalText: 'Place build at top of the queue',
      },
      {
        key: 'private2',
        displayValue: 'item2',
        cancelRunningJobsVal: true,
        description: 'Place build at the top of the queue and cancel all running jobs',
        modalText: 'Place build at the top of the queue and cancel all running jobs',
      }
    ];
    return arr;
  }),

  item: or('job.build', 'build'),

  initialKey: '',
  selectionKey: reads('initialKey'),
  selection: computed('selectionKey', 'options.@each.key', function () {
    return this.options.findBy('key', this.selectionKey);
  }),

  increasePriorityTask: task(function* () {
    this.set('isLoading', true);
    yield eventually(this.item, (record) => {
      record.increasePriority(this.selection.cancelRunningJobsVal).then(() => {
        this.flashes.success('The build was successfully prioritized.');
        this.set('isLoading', false);
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
