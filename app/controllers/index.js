import Ember from 'ember';
import computed, { alias } from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),
  tabStates: service(),
  repositories: service(),

  @computed('features.proVersion', 'features.enterpriseVersion')
  landingPage(pro, enterprise) {
    let version = 'default';

    if (pro) {
      version = 'pro';
    } else if (enterprise) {
      version = 'enterprise';
    }

    return `landing/${version}-page`;
  },

  @alias('repositories.currentRepository') repo: null,

  @alias('tabStates.mainTab') tab: null,

  @alias('repo.currentBuild') build: null,

  @alias('repo.currentBuild.jobs.firstObject') job: null,
});
