import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  headData: service(),
  auth: service(),

  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  currentUser: alias('auth.currentUser'),
  tab: alias('repoController.tab'),

  jobStateDidChange: observer('job.state', function () {
    this.headData.set('buildState', this.get('job.state'));
  })
});
