import { reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  repoController: controller('repo'),

  repo: reads('model'),
  tab: reads('repoController.tab'),
});
