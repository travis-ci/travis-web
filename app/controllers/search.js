import Ember from 'ember';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Ember.Controller.extend({
  @service auth: null,
  @service tabStates: null,
  @service statusImages: null,
  @service repositories: null,

  @alias('repositories.searchResults.firstObject') repo: null,

  @alias('tabStates.mainTab') tab: null,

  @alias('repo.currentBuild') build: null,

  @alias('repo.currentBuild.jobs.firstObject') job: null,
});
