import EmberObject from '@ember/object';
import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

export default Controller.extend({
  @service ajax: null,

  @alias('model.repo') repo: null,

  @computed('model.pushes.[]', 'model.pullRequests.[]')
  cachesExist(pushes, pullRequests) {
    if (pushes || pullRequests) {
      return pushes.length || pullRequests.length;
    }
  },

  deleteRepoCache: task(function* () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      try {
        yield this.get('ajax').ajax(`/repos/${this.get('repo.id')}/caches`, 'DELETE');
      } catch (e) {}

      this.set('model', EmberObject.create());
    }
  }).drop()
});
