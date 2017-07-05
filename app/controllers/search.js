import Ember from 'ember';
import { alias } from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  auth: service(),
  tabStates: service(),
  statusImages: service(),
  repositories: service(),

  @alias('repositories.accessible.firstObject') repo: null,

  @alias('tabStates.mainTab') tab: null,

  @alias('repo.currentBuild') build: null,

  @alias('repo.currentBuild.jobs.firstObject') job: null,
});
