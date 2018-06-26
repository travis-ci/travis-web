import Component from '@ember/component';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  @service ajax: null,

  tagName: 'li',
  classNames: ['cache-item'],
  classNameBindings: ['cache.type'],

  delete: task(function* () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      let branch = this.get('cache.branch');
      let repo = this.get('repo');
      let headers = {
        'Travis-API-Version': '3'
      };

      let url = `/repo/${repo.get('id')}/caches?branch=${branch}`;

      yield this.get('ajax').ajax(url, 'DELETE', { headers });
      return this.get('caches').removeObject(this.get('cache'));
    }
  }).drop(),

  actions: {
    performDelete() {
      this.get('delete').perform();
    }
  }
});
