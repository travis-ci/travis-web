import EmberPowerSelect from 'ember-power-select/components/power-select';
import { computed } from '@ember/object';

const OPTIONS_FOR_SEARCH = 5;

const CSS_CLASSES = {
  DISABLED: 'travis-form__field-component--disabled',
  FIELD_COMPONENT: 'travis-form__field-component',
  FIELD_SELECT: 'travis-form__field-select'
};

export default class extends EmberPowerSelect {
  disabled = false;
  placeholder =  '';

  get onChange() {}
  get searchEnabled() {
    return this.options.length >= OPTIONS_FOR_SEARCH || !!this.search;
  }

  searchPlaceholder =  'Type to filter options...';

  allowClear =  false;
  horizontalPosition =  'auto';
  verticalPosition = 'below';

  @computed('disabled')
  get triggerClass() {
    const classes = [CSS_CLASSES.FIELD_COMPONENT, CSS_CLASSES.FIELD_SELECT];
    if (this.disabled) {
      classes.push(CSS_CLASSES.DISABLED);
    }
    return classes.join(' ');
  }
}
