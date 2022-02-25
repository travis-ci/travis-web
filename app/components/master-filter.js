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
  repoIds: '',
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
      let repoIds = '';
      repoIds = this.get('selectedRepos').join(',');
      this.set('repoIds', repoIds);
    }
  }
});
