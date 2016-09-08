import Ember from 'ember';
import config from 'travis/config/environment';

const { service, controller } = Ember.inject;
import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
  ajax: service(),
  repoController: controller('repo'),
  repo: Ember.computed.alias('repoController.repo'),
  isDeleting: false,

  cachesExist: Ember.computed('model.pushes.length', 'model.pullRequests.length', function () {
    return this.get('model.pushes.length') || this.get('model.pullRequests.length');
  }),

  deleteRepoCache: task(function * () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      try {
        yield this.get('ajax').ajax(`/repos/${this.get('repo.id')}/caches`, 'DELETE');
      } catch (e) {}

      this.set('model', Ember.Object.create());
    }
  }).drop()
});
