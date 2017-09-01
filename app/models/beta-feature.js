import Ember from 'ember';
import DS from 'ember-data';
import attr from 'ember-data/attr';
import { computed } from 'ember-decorators/object';

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  enabled: attr('boolean'),
  feedbackUrl: attr('string'),

  @computed('name')
  dasherizedName(name) {
    return Ember.String.dasherize(name);
  },

  @computed('dasherizedName')
  displayName(name) {
    return name
      .split('-')
      .map(x => x.capitalize())
      .join(' ');
  },
});
