import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['travistab-nav'],

  classCurrent: Ember.computed('tab', function () {
    if (this.get('tab') === 'current') {
      return 'active';
    }
  }),

  classBuilds: Ember.computed('tab', function () {
    if (this.get('tab') === 'builds') {
      return 'active';
    }
  }),

  classPullRequests: Ember.computed('tab', function () {
    if (this.get('tab') === 'pull_requests') {
      return 'active';
    }
  }),

  classBranches: Ember.computed('tab', function () {
    if (this.get('tab') === 'branches') {
      return 'active';
    }
  }),

  classBuild: Ember.computed('tab', function () {
    let classes, tab;
    tab = this.get('tab');
    classes = [];
    if (tab === 'build') {
      classes.push('active');
    }
    if (tab === 'build' || tab === 'job') {
      classes.push('display-inline');
    }
    return classes.join(' ');
  }),

  classJob: Ember.computed('tab', function () {
    if (this.get('tab') === 'job') {
      return 'active';
    }
  }),

  classRequests: Ember.computed('tab', function () {
    if (this.get('tab') === 'requests') {
      return 'active';
    }
  }),

  classCaches: Ember.computed('tab', function () {
    if (this.get('tab') === 'caches') {
      return 'active';
    }
  }),

  classSettings: Ember.computed('tab', function () {
    if (this.get('tab') === 'settings') {
      return 'active';
    }
  }),

  classRequest: Ember.computed('tab', function () {
    if (this.get('tab') === 'request') {
      return 'active';
    }
  })
});
