import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  api: service(),

  buildFilterLabel: 'All builds',
  allRepositories: [],
  filteredRepositories: [],
  selectedRepos: [],
  query: '',
  isEmpty: true,

  search: task(function* () {
    yield timeout(config.intervals.repositoryFilteringDebounceRate);
    let filteredRepos = this.allRepositories.filter(item => item.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1);
    this.set('filteredRepositories', filteredRepos);
  }).restartable(),

  didInsertElement() {
    return this.api.get('/repos').then((result) => {
      this.set('allRepositories', result.repositories);
      this.set('filteredRepositories', result.repositories);
      this.filteredRepositories.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
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
      this.setSelectedRepoIds(repoIds);

      if (!isEmpty(this.selectedRepos)) {
        this.set('isEmpty', false);
      }
    },
    allRepoSelection() {
      if (this.isEmpty) {
        this.set('selectedRepos', [-1]);
        this.set('isEmpty', false);
      } else {
        this.set('selectedRepos', []);
        this.setSelectedRepoIds('');
        this.set('isEmpty', true);
      }
      let repoIds = '';
      repoIds = this.get('selectedRepos').join(',');
      this.set('repoIds', repoIds);
      this.setSelectedRepoIds(repoIds);
    }
  }
});
