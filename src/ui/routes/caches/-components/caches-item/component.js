import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  ajax: service(),
  tagName: 'li',
  classNames: ['cache-item'],
  classNameBindings: ['cache.type'],
  isDeleting: false,

  delete: task(function* () {
    if (config.skipConfirmations || confirm('Are you sure?')) {
      const data = {
        branch: this.get('cache.branch')
      };
      const repo = this.get('repo');

      yield this.get('ajax').ajax(`/repos/${repo.get('id')}/caches`, 'DELETE', { data });
      return this.get('caches').removeObject(this.get('cache'));
    }
  }).drop(),

  actions: {
    performDelete() {
      this.get('delete').perform();
    }
  }
});
