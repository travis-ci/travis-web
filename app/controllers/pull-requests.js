import { reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  repoController: controller('repo'),

  repo: reads('repoController.repo'),
  tab: reads('repoController.tab'),

  pullRequests: reads('model'),
});
