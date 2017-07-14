import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import Visibility from 'npm:visibilityjs';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default Ember.Controller.extend({
  @service auth: null,
  @service tabStates: null,
  @service('updateTimes') updateTimesService: null,
  @service statusImages: null,
  @service popup: null,
  @service repositories: null,

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
