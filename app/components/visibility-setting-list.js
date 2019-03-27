import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, empty, not, lt, gt, equal, and } from '@ember/object/computed';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Component.extend(KeyboardShortcuts, {
  classNames: ['visibility-setting-list'],

  keyboardShortcuts: {
    'esc': 'closeConfirmationModal'
  },

  // An example item that might be in the options object:
  // private: {
  //   displayValue: 'you',
  //   description: 'Do not allow everyone to see insights from your private builds',
  //   modalText: 'Do not allow everyone to see my private insights',
  // }
  //
  // The key is used to match selected and currentSelection up with the correct details
  // `displayValue` is used to generate text for the modal
  // `description` is for the label next to the radio button
  // `modalText` can be used to override the generated modal text
  options: computed(() => ({})),
  optionKeys: computed('options', function () { return Object.keys(this.options); }),
  isShowingConfirmationModal: false,
  isNotShowingConfirmationModal: not('isShowingConfirmationModal'),
  isEmpty: empty('optionKeys'),
  isVisible: not('isEmpty'),
  doAutofocus: false,
  focusOnList: and('doAutofocus', 'isNotShowingConfirmationModal'),
  focusOnModal: and('doAutofocus', 'isShowingConfirmationModal'),

  selected: '',
  currentSelection: reads('selected'),
  currentSelectionIndex: computed('currentSelection', 'optionKeys.[]', function () {
    return this.optionKeys.findIndex((slug) => slug === this.currentSelection);
  }),
  selectedIndex: computed('selected', 'optionKeys.[]', function () {
    return this.optionKeys.findIndex((slug) => slug === this.selected);
  }),
  change: computed('selectedIndex', 'currentSelectionIndex', function () {
    return this.currentSelectionIndex - this.selectedIndex;
  }),
  isChangeNegative: lt('change', 0),
  isChangeNeutral: equal('change', 0),
  isChangePositive: gt('change', 0),

  selectionDetails: computed('currentSelection', 'options', function () {
    return this.options[this.currentSelection] || {};
  }),
  selectionDisplay: computed('currentSelection', 'selectionDetails.{displayValue}', function () {
    return this.selectionDetails.displayValue || this.currentSelection;
  }),

  didRender() {
    this._super(...arguments);
    let af = this.get('element').querySelector('[autofocus]');
    if (this.doAutofocus === true && af !== null) {
      af.focus();
      this.set('doAutofocus', false);
    }
  },

  actions: {
    confirm() {
      this.set('isShowingConfirmationModal', false);
      this.sendAction('onConfirm', this.currentSelection);
    },
    toggleConfirmationModal() {
      this.toggleProperty('isShowingConfirmationModal');
      this.set('doAutofocus', true);
    },
  }
});
