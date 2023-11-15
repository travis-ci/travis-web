import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import Controller, { inject as controller } from '@ember/controller';
import Ember from 'ember';
import eventually from 'travis/utils/eventually';
import Visibility from 'visibilityjs';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Controller.extend({
  auth: service(),
  repositories: service(),
  tabStates: service(),
  features: service(),
  updateTimesService: service('updateTimes'),

  queryParams: ['migrationStatus', 'serverType'],
  serverType: null,
  migrationStatus: null,

  jobController: controller('job'),
  buildController: controller('build'),
  buildsController: controller('builds'),
  scanResultController: controller('scan_result'),

  repos: alias('repositories.accessible'),
  currentUser: alias('auth.currentUser'),
  build: alias('buildController.build'),
  builds: alias('buildsController.model'),
  job: alias('jobController.job'),
  scanResult: alias('scanResultController.scanResult'),

  showGitHubApps: alias('features.github-apps'),

  showGitHubAppsCTA: computed('showGitHubApps', 'repo.private', 'currentUser', function () {
    let showGitHubApps = this.showGitHubApps;
    let isPrivate = this.get('repo.private');
    let currentUser = this.currentUser;
    return showGitHubApps && !isPrivate && !currentUser;
  }),

  isCentered: computed('auth.signedIn', 'features.dashboard', function () {
    let isSignedIn = this.get('auth.signedIn');
    let isDashboard = this.get('features.dashboard');
    return !isSignedIn || isDashboard;
  }),

  config,

  classNames: ['repo'],

  reset() {
    this.set('repo', null);
  },

  isEmpty: computed('repos.isLoaded', 'repos.[]', function () {
    let loaded = this.get('repos.isLoaded');
    let repos = this.repos;
    return loaded && isEmpty(repos);
  }),

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    let updateTimesService = this.updateTimesService;

    updateTimesService.push(this.build);
    updateTimesService.push(this.builds);
    updateTimesService.push(this.get('build.jobs'));
  },

  deactivate() {
    return this.stopObservingLastBuild();
  },

  activate(action) {
    this.stopObservingLastBuild();

    const observesLastBuild = ['index', 'current'];

    if (observesLastBuild.includes(action)) {
      this.observeLastBuild();
      this.set('tabStates.mainTab', 'current');
    } else {
      this.set('tabStates.mainTab', action);
    }
  },

  currentBuildDidChange() {
    return scheduleOnce('actions', this, this._currentBuildDidChange);
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
  }
});
