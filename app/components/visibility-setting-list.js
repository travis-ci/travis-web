import Component from '@ember/component';
import { computed } from '@ember/object';
import {
  reads,
  empty,
  not,
  lt,
  gt,
  equal,
  and
} from '@ember/object/computed';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';

export default Component.extend({
  classNames: ['visibility-setting-list'],

  keyboardShortcuts: {
    'esc': 'closeConfirmationModal'
  },

  // An example item that might be in the options array:
  // {
  //   key: 'private',
  //   displayValue: 'you',
  //   description: 'Do not allow everyone to see insights from your private builds',
  //   modalText: 'Do not allow everyone to see my private insights',
  // }
  //
  // `key` is used to match initialKey and selectionKey up with the correct details
  // `displayValue` is used to generate text for the modal
  // `description` is for the label next to the radio button
  // `modalText` can be used to override the generated modal text
  options: computed(() => []),

  isEmpty: empty('options'),
  isVisible: not('isEmpty'),

  isShowingConfirmationModal: false,
  isNotShowingConfirmationModal: not('isShowingConfirmationModal'),
  onConfirm() {},

  doAutofocus: false,
  focusOnList: and('doAutofocus', 'isNotShowingConfirmationModal'),
  focusOnModal: and('doAutofocus', 'isShowingConfirmationModal'),

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
  selectionTitle: computed('selection.{displayValue,key}', function () {
    return this.selection.displayValue || this.selection.key;
  }),

  change: computed('initialIndex', 'selectionIndex', function () {
    return this.selectionIndex - this.initialIndex;
  }),
  isChangeNegative: lt('change', 0),
  isChangeNeutral: equal('change', 0),
  isChangePositive: gt('change', 0),

  didRender() {
    this._super(...arguments);
    let af = this.element.querySelector('[autofocus]');
    if (this.doAutofocus === true && af !== null) {
      af.focus();
      this.set('doAutofocus', false);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  actions: {
    confirm() {
      this.set('isShowingConfirmationModal', false);
      this.onConfirm(this.selectionKey);
    },
    toggleConfirmationModal() {
      this.toggleProperty('isShowingConfirmationModal');
      this.set('doAutofocus', true);
    },
  }
});
