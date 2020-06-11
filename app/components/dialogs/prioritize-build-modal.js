import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import eventually from 'travis/utils/eventually';
import { task } from 'ember-concurrency';

export default Component.extend({
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
  keyboardShortcuts: {
    'esc': 'isOpen'
  },

  isOpen: false,

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

  increasePriority: task(function* () {
    let type = this.type;
    this.set('isLoading', true);
    yield eventually(this.item, (record) => {
      record.increasePriority(this.selection.cancelRunningJobsVal).then((response) => {
        this.flashes.success(`The ${type} was successfully prioritized.`);
        this.set('isLoading', false);
        this.set('isShowingConfirmationModal', false);
      }, () => {
        this.flashes.error(`An error occurred. The ${type} could not be prioritized.`);
      });
    });
  }).drop(),

  displayFlashError(status, action) {
    let type = this.type;
    if (status === 422 || status === 400) {
      let actionTerm = action === 'restart' ? 'restarted' : 'canceled';
      this.flashes.error(`This ${type} can’t be ${actionTerm}`);
    } else if (status === 403) {
      let actionTerm = action === 'restart' ? 'restart' : 'cancel';
      this.flashes.error(`You don’t have sufficient access to ${actionTerm} this ${type}`);
    } else {
      let actionTerm = action === 'restart' ? 'restarting' : 'canceling';
      this.flashes.error(`An error occurred when ${actionTerm} the ${type}`);
    }
  },

  actions: {
    // selectCancellationReason(reason) {
    //   this.set('selectedCancellationReason', reason.name);
    // },
  }
});
