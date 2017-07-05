import Ember from 'ember';
import computed, { alias } from 'ember-computed-decorators';
import Visibility from 'npm:visibilityjs';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),
  tabStates: service(),
  updateTimesService: service('updateTimes'),
  statusImages: service(),
  popup: service(),
  repositories: service(),

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    this.get('updateTimesService').push(this.get('build.stages'));
    this.get('updateTimesService').push(this.get('build.jobs'));
  },

  @computed('features.proVersion')
  landingPage(pro) {
    let version = pro ? 'pro' : 'default';

    return `landing-${version}-page`;
  },

  @alias('repositories.accessible.firstObject') repo: null,

  @alias('tabStates.mainTab') tab: null,

  @alias('repo.currentBuild') build: null,

  @alias('build.jobs.firstObject') job: null,
});
