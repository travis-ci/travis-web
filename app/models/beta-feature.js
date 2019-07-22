import Model, { attr } from '@ember-data/model';
import { dasherize } from '@ember/string';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr('string'),
  description: attr('string'),
  enabled: attr('boolean'),
  feedbackUrl: attr('string'),

  dasherizedName: computed('name', function () {
    return dasherize(this.name);
  }),

  displayName: computed('dasherizedName', function () {
    return this.dasherizedName
      .split('-')
      .map(x => x.capitalize())
      .join(' ');
  })
});
