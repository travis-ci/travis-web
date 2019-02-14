import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['visibility-setting-list'],

  options: [],
  selected: '',
  isShowingConfirmationModal: false,
  currentSelection: reads('selected'),
  currentSelectionIndex: computed('currentSelection', 'options',
    function () {
      return this.options.findIndex((el) => el.value === this.currentSelection);
    }
  ),
  currentSelectionObj: computed('currentSelectionIndex', 'options',
    function () {
      if (typeof this.currentSelectionIndex !== 'number' || this.currentSelectionIndex < 0) {
        return {};
      }
      return this.options[this.currentSelectionIndex];
    }
  ),

  change: computed('selected', 'currentSelection', 'options',
    function () {
      const oldIndex = this.options.findIndex((el) => el.value === this.selected);
      const newIndex = this.options.findIndex((el) => el.value === this.currentSelection);

      return newIndex - oldIndex;
    }
  ),

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
  modalBodyText: computed('change', 'currentSelectionObj', function () {
    if (this.change === 0) {
      return 'Visibility update is in progress';
    }
    const selection = this.currentSelectionObj;

    if (selection.hasOwnProperty('modalText')) {
      return selection.modalText;
    }

    return `
This change will make your private build insights
${this.change < 0 ? 'only' : ''}
available to
${selection.displayValue || selection.value}
`;
  }),

  actions: {
    confirm() {
      this.set('isShowingConfirmationModal', false);
      this.sendAction('onConfirm', this.get('currentSelection'));
    }
  }
});
