import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  auth: service(),
  features: service(),
  tabStates: service(),
  statusImages: service(),
  repositories: service(),

  repo: alias('repositories.searchResults.firstObject'),

  tab: alias('tabStates.mainTab'),

  build: alias('repo.currentBuild'),

  job: alias('repo.currentBuild.jobs.firstObject'),
});
