import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, gt, notEmpty, or, filterBy, and } from '@ember/object/computed';
import config from 'travis/config/environment';

const { appName = 'travis-ci' } = config.githubApps;

export default Component.extend({
  router: service(), // for pagination

  owner: null,

  isShowingRepositoryMigrationModal: false,

  repositories: reads('owner.githubAppsRepositoriesOnOrg'),
  selectedRepositories: computed(() => []),
  selectableRepositories: filterBy('repositories', 'isMigratable'),

  hasRepos: gt('repositories.total', 0),
  isFiltering: notEmpty('repositories.filterTerm'),

  isAllSelected: computed('selectedRepositories.[]', 'selectableRepositories.[]', function () {
    const { selectedRepositories, selectableRepositories } = this;
    return selectableRepositories.every(repo => selectedRepositories.includes(repo));
  }),

  showSelectAll: computed('selectableRepositories.[]', function () {
    return this.selectableRepositories.length > 1;
  }),

  showActivationStep: and('repositories.isEmpty', 'repositories.isNotFiltering', 'repositories.isNotLoading'),
  showFilter: or('hasRepos', 'isFiltering', 'repositories.isLoading'),

  activateAllUrl: computed('owner.githubId', function () {
    const { githubId } = this.owner;
    return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  init() {
    this._super(...arguments);

    const { selectedRepositories, selectableRepositories } = this;
    if (selectableRepositories.length === 1) {
      selectedRepositories.addObjects(selectableRepositories);
    }
  },

  actions: {

    activateAll() {
      window.location.href = this.activateAllUrl;
    },

    toggleRepository(repo) {
      const { selectedRepositories } = this;
      const isSelected = selectedRepositories.includes(repo);

      if (isSelected) {
        selectedRepositories.removeObject(repo);
      } else {
        selectedRepositories.addObject(repo);
      }
    },

    toggleAll() {
      const { isAllSelected, selectableRepositories, selectedRepositories } = this;

      if (isAllSelected) {
        selectedRepositories.removeObjects(selectableRepositories.toArray());
      } else {
        selectedRepositories.addObjects(selectableRepositories.toArray());
      }
    },

    closeMigrateModal() {
      this.set('isShowingRepositoryMigrationModal', false);
      this.selectedRepositories.clear();
    }

  }

});
