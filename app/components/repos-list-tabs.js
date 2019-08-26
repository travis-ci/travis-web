import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  auth: service(),
  features: service(),
  tabStates: service(),

  tagName: 'nav',
  classNames: ['travistab-nav', 'travistab-nav--underline', 'travistab-nav--sidebar'],

  tab: alias('tabStates.sidebarTab'),

  currentUser: alias('auth.currentUser'),

  classRunning: computed('tab', function () {
    let tab = this.tab;
    return tab === 'running' ? 'active' : '';
  }),

  classOwned: computed('tab', 'currentUser', function () {
    let tab = this.tab;
    let currentUser = this.currentUser;
    let classes = [];
    if (tab === 'owned') {
      classes.push('active');
    }
    if (currentUser) {
      classes.push('display-inline');
    }
    return classes.join(' ');
  }),

  classNew: computed('currentUser', function () {
    let currentUser = this.currentUser;
    if (currentUser) {
      return 'display-inline';
    }
  }),
});
