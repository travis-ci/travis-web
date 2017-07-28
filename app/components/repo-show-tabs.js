import Ember from 'ember';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @service tabStates: null,

  tagName: 'nav',
  classNames: ['travistab-nav'],

  config,

  @alias('tabStates.mainTab') tab: null,

  @computed('tab')
  classCurrent(tab) {
    if (tab === 'current') {
      return 'active';
    }
  },

  @computed('tab')
  classBuilds(tab) {
    if (tab === 'builds') {
      return 'active';
    }
  },

  @computed('tab')
  classPullRequests(tab) {
    if (tab === 'pull_requests') {
      return 'active';
    }
  },

  @computed('tab')
  classBranches(tab) {
    if (tab === 'branches') {
      return 'active';
    }
  },

  @computed('tab')
  classBuild(tab) {
    let classes;
    classes = [];
    if (tab === 'build') {
      classes.push('active');
    }
    if (tab === 'build' || tab === 'job') {
      classes.push('display-inline');
    }
    return classes.join(' ');
  },

  @computed('tab')
  classJob(tab) {
    if (tab === 'job') {
      return 'active';
    }
  },

  @computed('tab')
  classRequests(tab) {
    if (tab === 'requests') {
      return 'active';
    }
  },

  @computed('tab')
  classCaches(tab) {
    if (tab === 'caches') {
      return 'active';
    }
  },

  @computed('tab')
  classSettings(tab) {
    if (tab === 'settings') {
      return 'active';
    }
  },

  @computed('tab')
  classRequest(tab) {
    if (tab === 'request') {
      return 'active';
    }
  },
});
