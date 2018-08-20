import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: '',

  @computed('user.name', 'user.login')
  nameOrLogin(name, login) {
    return name || login;
  },
});
