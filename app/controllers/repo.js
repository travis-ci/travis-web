import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import Controller from '@ember/controller';
import Ember from 'ember';
import eventually from 'travis/utils/eventually';
import Visibility from 'npm:visibilityjs';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import config from 'travis/config/environment';

export default Controller.extend({
  @service auth: null,
  @service repositories: null,
  @service tabStates: null,
  @service features: null,
  @service('updateTimes') updateTimesService: null,

  @controller('job') jobController: null,
  @controller('build') buildController: null,
  @controller('builds') buildsController: null,

  @alias('repositories.accessible') repos: null,
  @alias('auth.currentUser') currentUser: null,
  @alias('buildController.build') build: null,
  @alias('buildsController.model') builds: null,
  @alias('jobController.job') job: null,

  @alias('features.github-apps') showGitHubApps: null,

  @computed('showGitHubApps', 'repo.private', 'currentUser')
  showGitHubAppsCTA(showGitHubApps, isPrivate, currentUser) {
    return showGitHubApps && !isPrivate && !currentUser;
  },

  config,

  classNames: ['repo'],

  reset() {
    this.set('repo', null);
  },

  @computed('repos.isLoaded', 'repos.[]')
  isEmpty(loaded, repos) {
    return loaded && isEmpty(repos);
  },

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
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
