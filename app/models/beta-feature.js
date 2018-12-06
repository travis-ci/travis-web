import { dasherize } from '@ember/string';
import DS from 'ember-data';
import attr from 'ember-data/attr';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  enabled: attr('boolean'),
  feedbackUrl: attr('string'),

  dasherizedName: computed('name', function () {
    return dasherize(this.get('name'));
  }),

  displayName: computed('dasherizedName', function () {
    return this.get('dasherizedName')
      .split('-')
      .map(x => x.capitalize())
      .join(' ');
  })
});
