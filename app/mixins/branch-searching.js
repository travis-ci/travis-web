import Mixin from '@ember/object/mixin';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Mixin.create({
  store: service(),

  searchBranch: task(function* (repositoryId, query = '', filter = []) {
    yield timeout(config.intervals.searchDebounceRate);
    let branches = yield this.store.query('branch', {
      repository_id: repositoryId,
      data: {
        name: query,
        sort_by: 'name',
        limit: query.length > 3 ? 100 : 10,
        exists_on_github: true
      }
    });
    return branches.reject(branch => (filter.includes(branch.name)));
  }).restartable()
});
