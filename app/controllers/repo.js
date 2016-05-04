import Ember from 'ember';
import { githubRepo, statusImage } from 'travis/utils/urls';
import config from 'travis/config/environment';
import eventually from 'travis/utils/eventually';


const { controller, service } = Ember.inject;

export default Ember.Controller.extend({
  updateTimesService: service('updateTimes'),
  popup: service(),

  jobController: controller('job'),
  buildController: controller('build'),
  buildsController: controller('builds'),
  reposController: controller('repos'),
  reposBinding: 'reposController.repos',
  currentUserBinding: 'auth.currentUser',

  classNames: ['repo'],

  build: Ember.computed.alias('buildController.build'),
  builds: Ember.computed.alias('buildsController.content'),
  job: Ember.computed.alias('jobController.job'),

  reset() {
    this.set('repo', null);
  },

  isEmpty: function() {
    return this.get('repos.isLoaded') && this.get('repos.length') === 0;
  }.property('repos.isLoaded', 'repos.length'),

  statusImageUrl: function() {
    return statusImage(this.get('repo.slug'));
  }.property('repo.slug'),

  showCurrentBuild: function() {
    return this.get('repo.lastBuildId') && this.get('repo.active');
  }.property('repo.lastBuildId', 'repo.active'),

  actions: {
    statusImages() {
      this.get('popup').open('status-images');
      return false;
    }
  },

  slug: function() {
    return this.get('repo.slug');
  }.property('repo.slug'),

  isLoading: function() {
    return this.get('repo.isLoading');
  }.property('repo.isLoading'),

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(this.config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    let updateTimesService = this.get('updateTimesService');

    updateTimesService.push(this.get('build'));
    updateTimesService.push(this.get('builds'));
    updateTimesService.push(this.get('build.jobs'));
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

  viewCrons() {
    return this.connectTab('crons');
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
    let lastBuild = this.get('repo.lastBuild');
    if(lastBuild) {
      eventually(lastBuild, (build) => {
        this.set('build', build);
      });
    }
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
