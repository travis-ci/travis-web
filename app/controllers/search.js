import Ember from 'ember';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';

export default Ember.Controller.extend({
  @service auth: null,
  @service tabStates: null,
  @service statusImages: null,
  @service repositories: null,

  @controller repos: null,

  @alias('repos.repos.firstObject') repo: null,

  @alias('tabStates.mainTab') tab: null,

  @alias('repo.currentBuild') build: null,

  @alias('repo.currentBuild.jobs.firstObject') job: null,
});
