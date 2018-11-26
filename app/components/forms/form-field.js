import Component from '@ember/component';
import { presense } from 'travis/utils/form-validators';
import { combineValidators } from 'travis/helpers/combine-validators';
import { equal } from '@ember/object/computed';

export const FIELD_STATE = {
  DEFAULT: 'default',
  VALID: 'valid',
  ERROR: 'error'
};

export default Component.extend({
  classNames: ['travis-form__field'],
  classNameBindings: [
    'isValid:travis-form__field--valid',
    'isError:travis-form__field--error'
  ],

  fieldComponentName: 'forms/form-input',
  fieldElementId: null,
  form: null,

  state: FIELD_STATE.DEFAULT,

  label: '',
  value: '',
  placeholder: '',
  helperText: '',
  disabled: false,

  validator: () => true,
  required: equal('validator.kind', presense),

  onChange() {},
  onFocus() {},
  onBlur() {},

  errorMessage: '',

  isDefault: equal('state', FIELD_STATE.DEFAULT),
  isValid: equal('state', FIELD_STATE.VALID),
  isError: equal('state', FIELD_STATE.ERROR),

  validate(value) {
    let validator = this.validator;
    if (this.required && validator.kind !== presense) {
      validator = combineValidators([validator, presense()]);
    }
    const validationResult = validator(value || this.value);
    if (validationResult === true) {
      this.setValid();
    } else {
      this.setError(validationResult);
    }
  },

  setValid() {
    this.set('state', FIELD_STATE.VALID);
  },

  setError(errorMessage) {
    const state = FIELD_STATE.ERROR;
    this.setProperties({ state, errorMessage });
  },

  clearError() {
    const state = FIELD_STATE.DEFAULT;
    this.setProperties({ state, errorMessage: '' });
  },

  didInsertElement() {
    this._super(...arguments);
    this.form.registerField(this);
    if (this.value) {
      this.validate();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.form.unregisterField(this);
  },

  actions: {

    handleFocus() {
      this.clearError();
      this.onFocus();
    },

    handleBlur(value) {
      this.validate(value);
      this.onBlur(value);
    },

    handleChange(value) {
      this.validate(value);
      this.onChange(value);
    },

    setFieldElementId(fieldElementId) {
      this.setProperties({ fieldElementId });
    }

  }

});
