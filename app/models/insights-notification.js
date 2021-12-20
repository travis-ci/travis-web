import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  type: attr('string'),
  pluginName: attr('string'),
  pluginType: attr('string'),
  pluginCategory: attr('string'),
  message: attr('string'),
  active: attr('boolean'),
  weight: attr('number'),
  description: attr('string'),
  descriptionLink: attr('string'),
  probeSeverity: attr('string'),

  activeStatus: computed('active', function () {
    return this.active ? 'Active' : 'Snoozed';
  }),

  alertMessage: computed('probeSeverity', function () {
    switch (this.probeSeverity) {
      case 'info':
        return 'Info';
      case 'low':
        return 'Severity Low';
      case 'med':
        return 'Severity Medium';
      case 'high':
        return 'Severity High';
    }
  }),
});
