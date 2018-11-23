import Component from '@ember/component';
import { computed } from '@ember/object';
import { gt, filterBy, not } from '@ember/object/computed';
import * as validators from 'travis/utils/form-validators';

export default Component.extend({
  tagName: '',

  validators,

  erroredFields: filterBy('fields', 'isError', true),
  validFields: filterBy('fields', 'isValid', true),

  hasErrors: gt('erroredFields.length', 0),

  isValid: computed('fields.@each', 'validFields.@each', function () {
    return this.validFields.length === this.fields.length;
  }),

  isNotValid: not('isValid'),

  onSubmit() {},

  registerField(field) {
    this.fields.addObject(field);
  },

  unregisterField(field) {
    this.fields.removeObject(field);
  },

  validate() {
    this.fields.invoke('validate');
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
    }

  }
});
