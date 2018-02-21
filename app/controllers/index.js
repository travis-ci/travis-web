import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Controller.extend({
  @service auth: null,
  @service tabStates: null,
  @service('updateTimes') updateTimesService: null,
  @service statusImages: null,
  @service repositories: null,

  init() {
    this._super(...arguments);
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
