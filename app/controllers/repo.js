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
  repos: alias('repositories.accessible'),
  currentUser: alias('auth.currentUser'),

  classNames: ['repo'],

  build: Ember.computed.alias('buildController.build'),
  builds: Ember.computed.alias('buildsController.content'),
  job: Ember.computed.alias('jobController.job'),

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

    const observesLastBuild = ['index', 'current'];

    if (observesLastBuild.includes(action)) {
      this.observeLastBuild();
      this.set('tabStates.mainTab', 'current');
    } else {
      this.set('tabStates.mainTab', action);
    }
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
});
