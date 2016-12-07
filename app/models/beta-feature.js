import Ember from 'ember';
import DS from 'ember-data';
import attr from 'ember-data/attr';

const { computed } = Ember;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  enabled: attr('boolean'),

  dasherizedName: computed('name', function () {
    return Ember.String.dasherize(this.get('name'));
  })
});
