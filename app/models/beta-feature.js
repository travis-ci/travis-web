import Ember from 'ember';
import DS from 'ember-data';
import attr from 'ember-data/attr';

const { computed } = Ember;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  enabled: attr('boolean'),
  feedbackUrl: attr('string'),

  dasherizedName: computed('name', function () {
    return Ember.String.dasherize(this.get('name'));
  }),

  displayName: computed('dasherizedName', function () {
    return this.get('name').split('-')
          .map(function (x) { return x.capitalize(); })
          .join(' ');
  })
});
