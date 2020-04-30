import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  delimeter: ',',
  initialValue: '',
  value: reads('initialValue'),

  fields: computed('value', {
    get() {
      return (this.value || '').split(this.delimeter).map(value => ({ value }));
    },
    set(_, value) {
      return value;
    }
  }),
  lastFieldIndex: computed('fields.length', function () {
    return this.fields.length - 1;
  }),

  didInsertElement() {
    this._super(...arguments);
    const values = this.fields.map(input => input.value);
    if (values.length > 0 && values[0]) {
      this.validateMultipleInputs(values);
    }
  },

  validateMultipleInputs() { },
  updateValues() { },
  handleValidation(values) {
    this.validateMultipleInputs(values);
    this.updateValues(values);
  },

  actions: {

    handleBlur() {
      const values = this.fields.map(input => input.value);
      this.handleValidation(values);
      const value = values.join(this.delimeter);
      this.set('value', value);
    },

    handleChange(index, { target }) {
      const { value } = target;
      const fields = [...this.fields];
      fields[index] = { value };
      const values = fields.map(input => input.value);
      this.handleValidation(values);
      this.set('fields', fields);
    },

    removeInput(inputIndex, e) {
      e.preventDefault();
      const filteredFields = this.fields.filter((_, index) => index !== inputIndex);
      const values = filteredFields.map(input => input.value);
      this.handleValidation(values);
      this.set('fields', filteredFields);
    },

    addInput(e) {
      e.preventDefault();
      this.set('fields', [...this.fields, { value: '' }]);
    },
  }
});
