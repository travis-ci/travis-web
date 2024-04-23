import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

const OPTIONS_FOR_SEARCH = 5;

const CSS_CLASSES = {
  DISABLED: 'travis-form__field-component--disabled',
  FIELD_COMPONENT: 'travis-form__field-component',
  FIELD_SELECT: 'travis-form__field-select'
};

export default class extends Component {
  @tracked disabled = false;
  get placeholder() {
    return this.args.placeholder || '';
  }

  get onChange() { }
  get searchEnabled() {
    return (this.args.options && this.args.options.length >= OPTIONS_FOR_SEARCH) || !!this.search || this.args.searchEnabled;
  }

  get searchPlaceholder() {
    return this.args.searchPlaceholder || 'Type to filter options...';
  }

  get allowClear() { return this.args.allowClear || false };
  get horizontalPosition() { return this.args.horizontalPosition || 'auto'; }
  get verticalPosition() { return this.args.verticalPosition || 'below'; }

  get triggerClass() {
    const classes = [CSS_CLASSES.FIELD_COMPONENT, CSS_CLASSES.FIELD_SELECT];
    if (this.disabled) {
      classes.push(CSS_CLASSES.DISABLED);
    }
    return classes.join(' ');
  }
}
