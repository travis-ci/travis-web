import Ember from 'ember';
import eventually from 'travis/utils/eventually';
import Visibility from 'npm:visibilityjs';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  updateTimesService: service('updateTimes'),
  popup: service(),
  externalLinks: service(),
  statusImages: service(),

  jobController: controller('job'),
  buildController: controller('build'),
  buildsController: controller('builds'),
  reposController: controller('repos'),
  repos: alias('reposController.repos'),
  currentUser: alias('auth.currentUser'),

  classNames: ['repo'],

  build: Ember.computed.alias('buildController.build'),
  builds: Ember.computed.alias('buildsController.content'),
  job: Ember.computed.alias('jobController.job'),

  reset() {
    this.set('repo', null);
  },

  isEmpty: Ember.computed('repos.isLoaded', 'repos.length', function () {
    return this.get('repos.isLoaded') && this.get('repos.length') === 0;
  }),

  statusImageUrl: Ember.computed('repo.slug', 'repo.defaultBranch.name', function () {
    return this.get('statusImages').imageUrl(
      this.get('repo.slug'),
      this.get('repo.defaultBranch.name')
    );
  }),

  showCurrentBuild: Ember.computed('repo.currentBuild.id', 'repo.active', function () {
    return this.get('repo.currentBuild.id') && this.get('repo.active');
  }),

  actions: {
    statusImages() {
      this.get('popup').open('status-images');
      return false;
    }
  },

  slug: Ember.computed('repo.slug', function () {
    return this.get('repo.slug');
  }),

  isLoading: Ember.computed('repo.isLoading', function () {
    return this.get('repo.isLoading');
  }),

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
    return this[('view_' + action).camelize()]();
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

  currentBuildDidChange() {
    return Ember.run.scheduleOnce('actions', this, this._currentBuildDidChange);
  },

  _currentBuildDidChange() {
    let currentBuild = this.get('repo.currentBuild');
    if (currentBuild && currentBuild.get('id')) {
      eventually(currentBuild, (build) => {
        this.set('build', build);

        if (build.get('jobs.length') === 1) {
          this.set('job', build.get('jobs.firstObject'));
        }
      });
    }
  },

  stopObservingLastBuild() {
    return this.removeObserver('repo.currentBuild', this, 'currentBuildDidChange');
  },

  observeLastBuild() {
    this.currentBuildDidChange();
    return this.addObserver('repo.currentBuild', this, 'currentBuildDidChange');
  },

  connectTab(tab) {
    tab === 'current' ? 'build' : tab;
    return this.set('tab', tab);
  },

  urlGithub: Ember.computed('repo.slug', function () {
    return this.get('externalLinks').githubRepo(this.get('repo.slug'));
  })
});
