import EmberObject, { computed } from '@ember/object';
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Controller.extend({
  api: service(),
  flashes: service(),

  repo: alias('model.repo'),

  config,

  cachesExist: computed('model.pushes.[]', 'model.pullRequests.[]', function () {
    let pushes = this.get('model.pushes');
    let pullRequests = this.get('model.pullRequests');
    if (pushes || pullRequests) {
      return pushes.length || pullRequests.length;
    }
  }),

  deleteRepoCache: task(function* () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      try {
        yield this.api.delete(`/repo/${this.get('repo.id')}/caches`);
        this.set('model', EmberObject.create());
      } catch (e) {
        this.flashes.error('Could not delete the caches');
      }
    }
  }).drop()
});
