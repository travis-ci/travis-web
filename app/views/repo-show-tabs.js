import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'repos/show/tabs',
  tabBinding: 'controller.tab',
  contextBinding: 'controller',

  classCurrent: function() {
    return this.get('tab') === 'current' ? 'active' : null;
  }.property('tab'),

  classBuilds: function() {
    return this.get('tab') === 'builds' ? 'active' : null;
  }.property('tab'),

  classPullRequests: function() {
    return this.get('tab') === 'pull_requests' ? 'active' : null;
  }.property('tab'),

  classBranches: function() {
    return this.get('tab') === 'branches' ? 'active' : null;
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
    return this.get('tab') === 'job' ? 'active' : null;
  }.property('tab'),

  classRequests: function() {
    return this.get('tab') === 'requests' ? 'active' : null;
  }.property('tab'),

  classCaches: function() {
    return this.get('tab') === 'caches' ? 'active' : null;
  }.property('tab'),

  classSettings: function() {
    return this.get('tab') === 'settings' ? 'active' : null;
  }.property('tab'),

  classRequest: function() {
    return this.get('tab') === 'request' ? 'active' : null;
  }.property('tab')
});
