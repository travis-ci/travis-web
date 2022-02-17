import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default Component.extend({
  api: service(),
  store: service(),

  buildFilterLabel: 'All Builds',
  isAllSelected: false,
  allRepositories: [],
  selectedRepos: [],
  repoData: [],
  query: '',

  search: task(function* () {
    yield timeout(config.intervals.repositoryFilteringDebounceRate);
    yield this.allRepositories.applyFilter(this.query);
  }).restartable(),

  didInsertElement() {
    return this.api.get('/repos').then((result) => {
      this.set('allRepositories', result.repositories);
    });
  },

  actions: {
    toggleRepoCheck(repository) {
      if (this.selectedRepos.includes(repository)) {
        this.selectedRepos.removeObject(repository);
      } else {
        this.selectedRepos.pushObject(repository);
      }
      this.getRepoData(this.selectedRepos.join(','));
    }
  },
  getRepoData(selectedRepos) {
    const path = '/insights_spotlight_summary';
    const repositories =
      selectedRepos.length > 0
        ? `&repo_id=${encodeURIComponent(selectedRepos)}`
        : '';

    const params = `?time_start=2021-11-07&time_end=2021-11-09${repositories}`;

    const url = `${path}${params}`;
    this.api.get(url).then((result) => {
      this.set('repoData', result);
    });
  }
});
