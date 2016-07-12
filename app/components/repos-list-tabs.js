import Ember from 'ember';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  auth: service(),
  tagName: 'nav',
  classNames: ['travistab-nav', 'travistab-nav--underline', 'travistab-nav--sidebar'],

  currentUser: alias('auth.currentUser'),

  classRecent: Ember.computed('tab', function () {
    if (this.get('tab') === 'recent') {
      return 'active';
    } else if (this.get('tab') === 'search' && this.get('auth.signedIn')) {
      return 'hidden';
    }
  }),

  classRunning: Ember.computed('tab', function () {
    let classes;
    classes = [];
    if (this.get('tab') === 'running') {
      classes.push('active');
    }
    return classes.join(' ');
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

  classSearch: Ember.computed('tab', function () {
    if (this.get('tab') === 'search') {
      return 'active';
    }
  }),

  classNew: Ember.computed('currentUser', function () {
    if (this.get('currentUser')) {
      return 'display-inline';
    }
  })
});
