import { reads, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  repoController: controller('repo'),

  scanResult: reads('model'),
  repo: alias('repoController.repo'),
  tab: reads('repoController.tab'),
});
