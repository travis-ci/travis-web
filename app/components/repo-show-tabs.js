import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  tabStates: service(),

  tagName: 'nav',
  classNames: ['travistab-nav'],

  config,

  tab: alias('tabStates.mainTab'),

  classCurrent: computed('tab', function () {
    let tab = this.tab;
    if (tab === 'current') {
      return 'active';
    }
  }),

  classBuilds: computed('tab', function () {
    let tab = this.tab;
    if (tab === 'builds') {
      return 'active';
    }
  }),

  classPullRequests: computed('tab', function () {
    let tab = this.tab;
    if (tab === 'pull_requests') {
      return 'active';
    }
  }),

  classBranches: computed('tab', function () {
    let tab = this.tab;
    if (tab === 'branches') {
      return 'active';
    }
  }),

  classBuild: computed('tab', function () {
    let tab = this.tab;
    let classes;
    classes = [];
    if (tab === 'build') {
      classes.push('active');
    }
    if (tab === 'build' || tab === 'job') {
      classes.push('display-inline');
    }
    return classes.join(' ');
  }),

  classJob: computed('tab', function () {
    if (this.tab === 'job') {
      return 'active';
    }
  }),

  classRequests: computed('tab', function () {
    if (this.tab === 'requests') {
      return 'active';
    }
  }),

  classCaches: computed('tab', function () {
    if (this.tab === 'caches') {
      return 'active';
    }
  }),

  classSettings: computed('tab', function () {
    if (this.tab === 'settings') {
      return 'active';
    }
  }),

  classRequest: computed('tab', function () {
    if (this.tab === 'request') {
      return 'active';
    }
  }),
});
