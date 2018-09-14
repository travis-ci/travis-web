import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { observes } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service auth: null,

  @controller('repo') repoController: null,
  @alias('repoController.repo') repo: null,
  @alias('auth.currentUser') currentUser: null,
  @alias('repoController.tab') tab: null,

  @observes('job.state')
  jobStateDidChange() {
    return this.send('faviconStateDidChange', this.get('job.state'));
  },
});
