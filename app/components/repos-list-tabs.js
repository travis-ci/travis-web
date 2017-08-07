import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @service auth: null,
  @service tabStates: null,

  tagName: 'nav',
  classNames: ['travistab-nav', 'travistab-nav--underline', 'travistab-nav--sidebar'],

  @alias('tabStates.sidebarTab') tab: null,

  @alias('auth.currentUser') currentUser: null,

  @computed('tab')
  classRunning(tab) {
    return tab === 'running' ? 'active' : '';
  },

  @computed('tab', 'currentUser')
  classOwned(tab, currentUser) {
    let classes = [];
    if (tab === 'owned') {
      classes.push('active');
    }
    if (currentUser) {
      classes.push('display-inline');
    }
    return classes.join(' ');
  },

  @computed('currentUser')
  classNew(currentUser) {
    if (currentUser) {
      return 'display-inline';
    }
  },
});
