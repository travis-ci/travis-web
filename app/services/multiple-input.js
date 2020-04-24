import Service from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  label: '',
  delimeter: ',',
  inputString: null,
  required: '',

  inputs: computed('inputString', {
    get() {
      return (this.inputString || '')
        .split(this.delimeter)
        .map((inputValue, index) => ({
          label: `${this.label} ${index + 1}`,
          value: inputValue,
          required: this.required === 'first' && index === 0
        }));
    },
    set(_, value) {
      return value;
    }
  }),

  joinInputs() {
    const inputValues = this.inputs.map(input => input.value);
    return inputValues.join(this.delimeter);
  },

  addInput() {
    const nextInputNumber = this.inputs.length + 1;
    this.set('inputs', [
      ...this.inputs,
      { label: `${this.label} ${nextInputNumber}`, value: '', required: false }
    ]);
  },

  deleteInput(inputLabel) {
    const remainingInputs = this.inputs.filter(input => input.label !== inputLabel);
    this.set('inputs', remainingInputs);
  }
});
