import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  div: '',
  delimeter: ',',
  value: '',

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

  validateMultipleFields() {},
  updateValue() {},

  actions: {
    handleBlur() {
      const values = this.fields.map(input => input.value);
      this.validateMultipleFields(values);
      const value = values.join(this.delimeter);
      this.set('value', value);
      this.updateValue(value);
    },

    handleChange(index, { target }) {
      const { value } = target;
      const fields = [...this.fields];
      fields[index] = { value };
      const values = fields.map(input => input.value);
      this.validateMultipleFields(values);
      this.set('fields', fields);
    },

    removeInput(inputIndex, e) {
      e.preventDefault();
      const filteredFields = this.fields.filter((_, index) => index !== inputIndex);
      this.set('fields', filteredFields);
    },

    addInput(e) {
      e.preventDefault();
      this.set('fields', [...this.fields, { value: '' }]);
    },
  }
});
