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

  isBot: computed('user.vcs_id', function () {
    return this.get('user.vcsId') == '0';
  }),

  showUser: computed('nameOrLogin', 'eventType', 'isBot', function () {
    let nameOrLogin = this.nameOrLogin;
    let eventType = this.eventType;
    let isBot = this.isBot;
    return nameOrLogin && eventType !== 'cron' && !isBot;
  }),

  userProvider: or('user.provider', 'provider')
});
