import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import eventually from 'travis/utils/eventually';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';

export default Component.extend({
  keyboardShortcuts: {
    'esc': 'toggleConfirmationModal'
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
  isOpen: false,
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

  item: computed('type', 'job', 'build', function () {
    let type = this.type;
    let job = this.job;
    let build = this.build;
    if (type === 'job') {
      return job;
    } else {
      return build;
    }
  }),

  type: computed('job', 'build', function () {
    let job = this.job;
    if (job) {
      return 'job';
    } else {
      return 'build';
    }
  }),

  initialKey: '',
  initial: computed('initialKey', 'options.@each.key', function () {
    return this.options.findBy('key', this.initialKey);
  }),
  initialIndex: computed('initial', 'options.[]', function () {
    return this.options.indexOf(this.initial);
  }),

  selectionKey: reads('initialKey'),
  selection: computed('selectionKey', 'options.@each.key', function () {
    return this.options.findBy('key', this.selectionKey);
  }),
  selectionIndex: computed('selection', 'options.[]', function () {
    return this.options.indexOf(this.selection);
  }),

  increasePriorityTask: task(function* (value) {
    this.set('isLoading', true);
    yield eventually(this.item, (record) => {
      record.increasePriority(this.selection.cancelRunningJobsVal).then((response) => {
        this.flashes.success('The build was successfully prioritized.');
        this.set('isLoading', false);
        this.set('isOpen', false);
        console.log(this.get('isOpen'));
      }, () => {
        this.flashes.error('An error occurred. The build could not be prioritized.');
      });
    });
  }).drop(),
  actions: {
    toggleConfirmationModal() {
      // console.log(this.loading);
      // if (!this.isLoading) {
      //   // this.toggleProperty('isShowingConfirmationModal');
      //   this.set('showCancelModal', false);
      //   this.set('doAutofocus', true);
      // }
      this.set('isOpen', false);
      this.set('doAutofocus', true);
    },
  }
});
