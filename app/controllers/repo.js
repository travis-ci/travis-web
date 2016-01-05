import Ember from 'ember';
import { githubRepo } from 'travis/utils/urls';

export default Ember.Controller.extend({
  jobController: Ember.inject.controller('job'),
  buildController: Ember.inject.controller('build'),
  buildsController: Ember.inject.controller('builds'),
  reposController: Ember.inject.controller('repos'),
  currentUserBinding: 'auth.currentUser',

  classNames: ['repo'],

  build: Ember.computed.alias('buildController.build'),
  builds: Ember.computed.alias('buildsController.content'),
  job: Ember.computed.alias('jobController.job'),

  slug: function() {
    return this.get('repo.slug');
  }.property('repo.slug'),

  isLoading: function() {
    return this.get('repo.isLoading');
  }.property('repo.isLoading'),

  init() {
    this._super.apply(this, arguments);
    if (!Ember.testing) {
      return Visibility.every(this.config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    return Ember.run(this, function() {
      var build, builds, jobs;
      if (builds = this.get('builds')) {
        builds.forEach(function(b) {
          return b.updateTimes();
        });
      }
      if (build = this.get('build')) {
        build.updateTimes();
      }
      if (build && (jobs = build.get('jobs'))) {
        return jobs.forEach(function(j) {
          return j.updateTimes();
        });
      }
    });
  },

  deactivate() {
    return this.stopObservingLastBuild();
  },

  activate(action) {
    this.stopObservingLastBuild();
    return this[("view_" + action).camelize()]();
  },

  viewIndex() {
    this.observeLastBuild();
    return this.connectTab('current');
  },

  viewCurrent() {
    this.observeLastBuild();
    return this.connectTab('current');
  },

  viewBuilds() {
    return this.connectTab('builds');
  },

  viewPullRequests() {
    return this.connectTab('pull_requests');
  },

  viewBranches() {
    return this.connectTab('branches');
  },

  viewBuild() {
    return this.connectTab('build');
  },

  viewJob() {
    return this.connectTab('job');
  },

  viewRequests() {
    return this.connectTab('requests');
  },

  viewCaches() {
    return this.connectTab('caches');
  },

  viewRequest() {
    return this.connectTab('request');
  },

  viewSettings() {
    return this.connectTab('settings');
  },

  lastBuildDidChange() {
    return Ember.run.scheduleOnce('actions', this, this._lastBuildDidChange);
  },

  _lastBuildDidChange() {
    var build;
    build = this.get('repo.lastBuild');
    return this.set('build', build);
  },

  stopObservingLastBuild() {
    return this.removeObserver('repo.lastBuild', this, 'lastBuildDidChange');
  },

  observeLastBuild() {
    this.lastBuildDidChange();
    return this.addObserver('repo.lastBuild', this, 'lastBuildDidChange');
  },

  connectTab(tab) {
    var name;
    name = tab === 'current' ? 'build' : tab;
    return this.set('tab', tab);
  },

  urlGithub: function() {
    return githubRepo(this.get('repo.slug'));
  }.property('repo.slug')
});
