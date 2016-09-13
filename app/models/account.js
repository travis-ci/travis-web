import Ember from 'ember';
import attr from 'ember-data/attr';
import Model from 'ember-data/model';

const { alias } = Ember.computed;

export default Model.extend({
  name: attr(),
  type: attr(),
  avatarUrl: attr(),
  reposCount: attr('number'),
  subscribed: attr('boolean'),
  education: attr('boolean'),
  login: alias('id'),
  displayName: Ember.computed('login', 'name', function () {
    if (Ember.isBlank(this.get('name'))) {
      return this.get('login');
    } else {
      return this.get('name');
    }
  })
});
