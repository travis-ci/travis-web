import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: '',

  @computed('user.name', 'user.login')
  nameOrLogin(name, login) {
    return name || login;
  },

  // TODO remove this once crons have the proper createdBy
  @computed('nameOrLogin', 'eventType')
  showUser(nameOrLogin, eventType) {
    return nameOrLogin && eventType !== 'cron';
  }
});
