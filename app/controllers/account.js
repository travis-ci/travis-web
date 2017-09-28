import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Controller.extend({
  @computed('model.account.{name,login}')
  accountName(name, login) {
    return name || login;
  }
});
