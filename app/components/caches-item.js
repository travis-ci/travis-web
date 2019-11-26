import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  api: service(),
  flashes: service(),

  tagName: 'li',
  classNames: ['cache-item'],
  classNameBindings: ['cache.type'],

  delete: task(function* () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      let branch = this.get('cache.branch');
      let repo = this.repo;

      let url = `/repo/${repo.get('id')}/caches?branch=${branch}`;

      try {
        yield this.api.delete(url);
        this.caches.removeObject(this.cache);
      } catch (e) {
        this.flashes.error('Could not delete the cache');
      }
    }
  }).drop(),

  actions: {
    performDelete() {
      this['delete'].perform();
    }
  }
});
