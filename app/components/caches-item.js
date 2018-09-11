import Component from '@ember/component';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  @service ajax: null,
  @service flashes: null,

  tagName: 'li',
  classNames: ['cache-item'],
  classNameBindings: ['cache.type'],

  delete: task(function* () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      let branch = this.get('cache.branch');
      let repo = this.get('repo');

      let url = `/repo/${repo.get('id')}/caches?branch=${branch}`;

      try {
        yield this.get('ajax').deleteV3(url);
        this.get('caches').removeObject(this.get('cache'));
      } catch (e) {
        this.get('flashes').error('Could not delete the cache');
      }
    }
  }).drop(),

  actions: {
    performDelete() {
      this.get('delete').perform();
    }
  }
});
