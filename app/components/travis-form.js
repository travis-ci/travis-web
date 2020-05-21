import Component from '@ember/component';
import { gt, filterBy, not } from '@ember/object/computed';
import * as validators from 'travis/utils/form-validators';

export default Component.extend({
  tagName: '',

  validators,

  erroredFields: filterBy('fields', 'isError', true),
  validFields: filterBy('fields', 'isValid', true),

  hasErrors: gt('erroredFields.length', 0),

  isValid: not('hasErrors'),

  onSubmit() {},

  registerField(field) {
    this.fields.addObject(field);
  },

  unregisterField(field) {
    this.fields.removeObject(field);
  },

  validate() {
    this.fields.forEach(field => {
      const {
        value,
        multipleInputsValue,
        isMultipleInputsField
      } = field;
      if (isMultipleInputsField) {
        field.validateMultipleInputs(multipleInputsValue || [''], true);
      } else {
        field.validate(value, true);
      }
    });
  },

  init() {
    this._super(...arguments);
    this.fields = [];
  },

  actions: {

    submit() {
      this.validate();
      if (this.isValid) {
        this.onSubmit();
      }
      return false;
    }

  }
});
