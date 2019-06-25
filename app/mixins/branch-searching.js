import Mixin from '@ember/object/mixin';
import { timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Mixin.create({
  store: service(),

  searchBranch: function* (repositoryId, query, filter = null) {
    yield timeout(config.intervals.searchDebounceRate);
    let branches = yield this.store.query('branch', {
      repository_id: repositoryId,
      data: {
        name: query,
        sort_by: 'name',
        limit: 10,
        exists_on_github: true
      }
    });
    if (filter) {
      return branches.reject(branch => (filter.includes(branch.name)));
    }
    return branches;
  }
});
