import Component from '@ember/component';
import { presense } from 'travis/utils/form-validators';
import { combineValidators } from 'travis/helpers/combine-validators';
import { computed } from '@ember/object';
import { equal, or, and, notEmpty, not } from '@ember/object/computed';

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
    'isFocused:travis-form__field--focused',
    'showIcon:travis-form__field--with-icon',
    'showFrame::travis-form__field--without-frame'
  ],

  fieldElementId: null,
  form: null,

  state: FIELD_STATE.DEFAULT,

  label: '',
  value: '',
  placeholder: '',
  helperText: '',
  disabled: false,
  requiredMark: '*',
  showRequiredMark: false,
  allowClear: false,
  icon: '',
  disableFrame: false,
  multiple: false,
  enableValidationStatusIcons: true,
  enableValidationStatusMessage: true,
  validateOnField: true,
  isMultipleInputsField: false,
  multipleInputsValue: null,

  validator: null,
  required: equal('validator.kind', presense),

  autoValidate: true,

  errorMessage: '',
  isFocused: false,

  isDefault: equal('state', FIELD_STATE.DEFAULT),
  isValid: equal('state', FIELD_STATE.VALID),
  isError: equal('state', FIELD_STATE.ERROR),

  requiresValidation: or('required', 'validator'),

  showClear: and('allowClear', 'value'),
  showIcon: notEmpty('icon'),
  showFrame: not('disableFrame'),
  showValidationStatusIcons: and('enableValidationStatusIcons', 'requiresValidation'),
  showValidationStatusMessage: and('enableValidationStatusMessage', 'requiresValidation'),

  selectComponent: computed('multiple', function () {
    return this.multiple ? 'forms/form-select-multiple' : 'forms/form-select';
  }),

  validate(value, isFormValidation = false) {
    if (!this.validateOnField && !isFormValidation) return true;
    let validator = this.validator;

    if (!validator) {
      if (this.required)
        validator = presense();
      else
        return;
    }

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

  onBlur() {},
  onFocus() {},
  onChange() {},
  onKeyUp() {},
  validateMultipleInputs(values = [''], isFormValidation = false) {
    this.set('multipleInputsValue', values);
    values.some(value => {
      this.validate(value, isFormValidation);
      return this.state === FIELD_STATE.ERROR;
    });
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

    validateMultipleInputs(values = [''], isFormValidation = false) {
      this.validateMultipleInputs(values, isFormValidation);
    },

    handleSelectBlur(publicAPI) {
      this.send('handleBlur', publicAPI.selected);
    },

    handleChange(value) {
      this.validate(value);
      this.onChange(value);
    },

    handleKeyUp(value) {
      this.onKeyUp(value);
    },

    handleClear() {
      if (this.allowClear)
        this.send('handleChange', '');
    },

    setFieldElementId(fieldElementId) {
      this.setProperties({ fieldElementId });
    }

  }

});
