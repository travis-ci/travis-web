import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  nameOrLogin: computed('user.name', 'user.login', function () {
    let name = this.get('user.name');
    let login = this.get('user.login');
    return name || login;
  }),

  showUser: computed('nameOrLogin', 'eventType', function () {
    let nameOrLogin = this.nameOrLogin;
    let eventType = this.eventType;
    return nameOrLogin && eventType !== 'cron';
  }),

  userProvider: or('user.provider', 'provider')
});
