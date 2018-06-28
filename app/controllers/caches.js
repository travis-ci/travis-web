import EmberObject from '@ember/object';
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

export default Controller.extend({
  @service ajax: null,
  @service flashes: null,

  @alias('model.repo') repo: null,

  config,

  @computed('model.pushes.[]', 'model.pullRequests.[]')
  cachesExist(pushes, pullRequests) {
    if (pushes || pullRequests) {
      return pushes.length || pullRequests.length;
    }
  },

  deleteRepoCache: task(function* () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      try {
        yield this.get('ajax').deleteV3(`/repo/${this.get('repo.id')}/caches`);
        this.set('model', EmberObject.create());
      } catch (e) {
        this.get('flashes').error('Could not delete the cache');
      }
    }
  }).drop()
});
