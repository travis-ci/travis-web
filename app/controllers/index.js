import Controller from '@ember/controller';
import Ember from 'ember';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Visibility from 'visibilityjs';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  auth: service(),
  tabStates: service(),
  updateTimesService: service('updateTimes'),
  statusImages: service(),
  repositories: service(),
  features: service(),

  config,

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  updateTimes() {
    this.updateTimesService.push(this.get('build.stages'));
    this.updateTimesService.push(this.get('build.jobs'));
  },

  landingPage: computed('features.proVersion', function () {
    let pro = this.get('features.proVersion');
    let version = pro ? 'pro' : 'default';

    return `landing-${version}-page`;
  }),

  repo: alias('repositories.accessible.firstObject'),
  tab: alias('tabStates.mainTab'),
  build: alias('repo.currentBuild'),
  job: alias('build.jobs.firstObject')
});
