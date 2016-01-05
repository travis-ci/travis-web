import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'repos/list/tabs',
  tabBinding: 'controller.tab',
  currentUserBinding: 'controller.currentUser.model',
  classRecent: function() {
    if (this.get('tab') === 'recent') {
      return 'active';
    } else if (this.get('tab') === 'search' && this.get('controller').auth.get('signedIn')) {
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
