import Ember from 'ember';
import eventually from 'travis/utils/eventually';
import Visibility from 'npm:visibilityjs';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  updateTimesService: service('updateTimes'),
  repositories: service(),
  popup: service(),
  tabStates: service(),

  jobController: controller('job'),
  buildController: controller('build'),
  buildsController: controller('builds'),
  reposController: controller('repos'),
  repos: alias('repositories.repos'),
  currentUser: alias('auth.currentUser'),

  classNames: ['repo'],

  build: Ember.computed.alias('buildController.build'),
  builds: Ember.computed.alias('buildsController.content'),
  job: Ember.computed.alias('jobController.job'),

  reset() {
    this.set('repo', null);
  },

  isEmpty: Ember.computed.alias('repositories.noResults'),

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
    console.log({action});
    this.stopObservingLastBuild();
    return this[('view_' + action).camelize()]();
  },

  viewIndex() {
    this.observeLastBuild();
    return this.setMainTabTo('current');
  },

  viewCurrent() {
    this.observeLastBuild();
    return this.setMainTabTo('current');
  },

  viewBuilds() {
    return this.setMainTabTo('builds');
  },

  viewPullRequests() {
    return this.setMainTabTo('pull_requests');
  },

  viewBranches() {
    return this.setMainTabTo('branches');
  },

  viewBuild() {
    return this.setMainTabTo('build');
  },

  viewJob() {
    return this.setMainTabTo('job');
  },

  viewRequests() {
    return this.setMainTabTo('requests');
  },

  viewCaches() {
    return this.setMainTabTo('caches');
  },

  viewRequest() {
    return this.setMainTabTo('request');
  },

  viewSettings() {
    return this.setMainTabTo('settings');
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

  setMainTabTo(tab) {
    tab === 'current' ? 'build' : tab;
    this.set('tabStates.mainTab', tab);
  },
});
