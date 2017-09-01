import Ember from 'ember';
import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Model.extend({
  name: attr(),
  type: attr(),
  avatarUrl: attr(),
  reposCount: attr('number'),
  subscribed: attr('boolean'),
  education: attr('boolean'),

  @alias('id') login: null,

  @computed('login', 'name')
  displayName(login, name) {
    if (Ember.isBlank(name)) {
      return login;
    }
    return name;
  },
});
