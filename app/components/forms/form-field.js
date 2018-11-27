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
    'isError:travis-form__field--error',
    'isFocused:travis-form__field--focused'
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

  autoValidate: true,

  onChange() {},
  onFocus() {},
  onBlur() {},

  errorMessage: '',
  isFocused: false,

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
    if (this.state === FIELD_STATE.ERROR) {
      const state = FIELD_STATE.DEFAULT;
      this.setProperties({ state, errorMessage: '' });
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.form.registerField(this);
    if (this.value && this.autoValidate) {
      this.validate();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.form.unregisterField(this);
  },

  actions: {

    handleFocus() {
      this.set('isFocused', true);
      this.clearError();
      this.onFocus();
    },

    handleBlur(value) {
      this.set('isFocused', false);
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
