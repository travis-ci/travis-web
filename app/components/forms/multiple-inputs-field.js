import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  delimeter: ',',
  initialValue: '',
  value: reads('initialValue'),

  fieldsValue: computed('value', {
    get() {
      return (this.value || '').split(this.delimiter).map(value => ({ value }));
    },
    set(_, value) {
      // Handle the setter logic if needed.
      // For example, you can parse the 'value' and update it.
      this.set('value', value.join(this.delimiter));
      return value;
    }
  }),

  fields: computed('fieldsValue', {
    get() {
      return this.fieldsValue;
    },
    set(_, value) {
      this.set('fieldsValue', value);
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
      this.set('valueValue', value);
    },

    handleChange(index, { target }) {
      const { value } = target;
      const fields = [...this.fields];
      fields[index] = { value };
      const values = fields.map(input => input.value);
      this.handleValidation(values);
      this.set('fieldsValue', fields);
    },

    removeInput(inputIndex, e) {
      e.preventDefault();
      const filteredFields = this.fields.filter((_, index) => index !== inputIndex);
      const values = filteredFields.map(input => input.value);
      this.handleValidation(values);
      this.set('fieldsValue', filteredFields);
    },

    addInput(e) {
      e.preventDefault();
      this.set('fieldsValue', [...this.fields, { value: '' }]);
    },
  }
});
