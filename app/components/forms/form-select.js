import EmberPowerSelect from 'ember-power-select/components/power-select';
import { computed } from '@ember/object';
import { gte } from '@ember/object/computed';

const OPTIONS_FOR_SEARCH = 5;

const CSS_CLASSES = {
  DISABLED: 'travis-form__field-component--disabled',
  FIELD_COMPONENT: 'travis-form__field-component',
  FIELD_SELECT: 'travis-form__field-select'
};

export default EmberPowerSelect.extend({
  disabled: false,
  placeholder: '',

  searchEnabled: gte('options.length', OPTIONS_FOR_SEARCH),
  searchPlaceholder: 'Type to filter options...',

  allowClear: false,
  horizontalPosition: 'auto',
  verticalPosition: 'below',

  triggerClass: computed('disabled', function () {
    const classes = [CSS_CLASSES.FIELD_COMPONENT, CSS_CLASSES.FIELD_SELECT];
    if (this.disabled) {
      classes.push(CSS_CLASSES.DISABLED);
    }
    return classes.join(' ');
  }),

  onChange() {},
  onFocus() {},
  onBlur() {},
  onInit() {},

  onchange: computed(function () {
    return (selected) => this.onChange(selected);
  }),

  onopen: computed(function () {
    return () => this.onFocus();
  }),

  onclose: computed(function () {
    return () => this.onBlur();
  }),

});
