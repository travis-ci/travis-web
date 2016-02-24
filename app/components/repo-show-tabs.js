import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['tabnav'],
  ariaRole: 'tablist',

  classCurrent: function() {
    if (this.get('tab') === 'current') {
      return 'active';
    }
  }.property('tab'),

  classBuilds: function() {
    if (this.get('tab') === 'builds') {
      return 'active';
    }
  }.property('tab'),

  classPullRequests: function() {
    if (this.get('tab') === 'pull_requests') {
      return 'active';
    }
  }.property('tab'),

  classCrons: function() {
    if (this.get('tab') === 'crons') {
      return 'active';
    }
  }.property('tab'),

  classBranches: function() {
    if (this.get('tab') === 'branches') {
      return 'active';
    }
  }.property('tab'),

  classBuild: function() {
    var classes, tab;
    tab = this.get('tab');
    classes = [];
    if (tab === 'build') {
      classes.push('active');
    }
    if (tab === 'build' || tab === 'job') {
      classes.push('display-inline');
    }
    return classes.join(' ');
  }.property('tab'),

  classJob: function() {
    if (this.get('tab') === 'job') {
      return 'active';
    }
  }.property('tab'),

  classRequests: function() {
    if (this.get('tab') === 'requests') {
      return 'active';
    }
  }.property('tab'),

  classCaches: function() {
    if (this.get('tab') === 'caches') {
      return 'active';
    }
  }.property('tab'),

  classSettings: function() {
    if (this.get('tab') === 'settings') {
      return 'active';
    }
  }.property('tab'),

  classRequest: function() {
    if (this.get('tab') === 'request') {
      return 'active';
    }
  }.property('tab')
});
