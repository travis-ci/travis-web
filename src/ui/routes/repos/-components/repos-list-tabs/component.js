import Ember from 'ember';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  auth: service(),
  tagName: 'nav',
  classNames: ['travistab-nav', 'travistab-nav--underline', 'travistab-nav--sidebar'],
  tabStates: service(),

  tab: alias('tabStates.sidebarTab'),

  currentUser: alias('auth.currentUser'),

  classRunning: Ember.computed('tab', function () {
    return this.get('tab') === 'running' ? 'active' : '';
  }),

  classOwned: Ember.computed('tab', 'currentUser', function () {
    let classes;
    classes = [];
    if (this.get('tab') === 'owned') {
      classes.push('active');
    }
    if (this.get('currentUser')) {
      classes.push('display-inline');
    }
    return classes.join(' ');
  }),

  classNew: Ember.computed('currentUser', function () {
    if (this.get('currentUser')) {
      return 'display-inline';
    }
  })
});
