import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, empty, not } from '@ember/object/computed';
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
  optionValues: computed('options', function () { return Object.values(this.options); }),
  isShowingConfirmationModal: false,
  isEmpty: empty('optionKeys'),
  isVisible: not('isEmpty'),

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

  selectionDetails: computed('currentSelection', 'options', function () {
    const { options, currentSelection } = this;

    if (!options.hasOwnProperty(currentSelection)) {
      return {};
    }

    return options[currentSelection];
  }),

  modalHeaderText: computed('change', function () {
    let operation;
    if (this.change < 0) {
      operation = 'Restrict';
    } else if (this.change > 0) {
      operation = 'Increase';
    } else {
      operation = 'Update';
    }

    return `${operation} visibility of your private build insights`;
  }),

  modalBodyText: computed('change', 'currentSelection', 'selectionDetails', function () {
    const { change, currentSelection, selectionDetails } = this;

    if (change === 0) {
      return 'Visibility update is in progress';
    }

    const { modalText = '' } = selectionDetails;
    if (modalText.length > 0) {
      return modalText;
    }

    const { displayValue = currentSelection } = selectionDetails;

    return `This change will make your private build insights ${change < 0 ? 'only' : ''} available to ${displayValue}`;
  }),

  didRender() {
    this._super(...arguments);
    let af = this.get('element').querySelector('[autofocus]');
    if (this.isShowingConfirmationModal === true && af !== null) {
      af.focus();
    }
  },

  actions: {
    confirm() {
      this.set('isShowingConfirmationModal', false);
      this.sendAction('onConfirm', this.currentSelection);
    },
    toggleConfirmationModal() {
      this.toggleProperty('isShowingConfirmationModal');
      if (this.isShowingConfirmationModal !== true) {
        this.get('element').querySelector('.visibility-setting-list-item--selected').focus();
      }
    },
    closeConfirmationModal() {
      if (this.isShowingConfirmationModal === true) {
        this.toggleProperty('isShowingConfirmationModal');
        this.get('element').querySelector('.visibility-setting-list-item--selected').focus();
      }
    }
  }
});
