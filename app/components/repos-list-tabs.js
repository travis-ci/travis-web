import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  auth: service(),

  currentUserBinding: 'auth.currentUser',

  classRecent: function() {
    if (this.get('tab') === 'recent') {
      return 'active';
    } else if (this.get('tab') === 'search' && this.get('auth.signedIn')) {
      return 'hidden';
    }
  }.property('tab'),

  classRunning: function() {
    var classes;
    classes = [];
    if (this.get('tab') === 'running') {
      classes.push('active');
    }
    return classes.join(' ');
  }.property('tab'),

  classOwned: function() {
    var classes;
    classes = [];
    if (this.get('tab') === 'owned') {
      classes.push('active');
    }
    if (this.get('currentUser')) {
      classes.push('display-inline');
    }
    return classes.join(' ');
  }.property('tab', 'currentUser'),

  classSearch: function() {
    if (this.get('tab') === 'search') {
      return 'active';
    }
  }.property('tab'),

  classNew: function() {
    if (this.get('currentUser')) {
      return 'display-inline';
    }
  }.property('currentUser')
});
