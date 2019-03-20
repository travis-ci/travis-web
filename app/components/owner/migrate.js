import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import config from 'travis/config/environment';

const { appName = 'travis-ci' } = config.githubApps;

export default Component.extend({
  router: service(), // for pagination

  owner: null,

  isShowingRepositoryMigrationModal: false,

  repositories: reads('owner.githubAppsRepositoriesOnOrg'),
  selectedRepositories: computed(() => []),

  isAllSelected: computed('selectedRepositories.[]', 'repositories.[]', function () {
    const { selectedRepositories, repositories } = this;
    return repositories.every(repo => selectedRepositories.includes(repo));
  }),

  showSelectAll: computed('repositories.[]', function () {
    return this.repositories.length > 1;
  }),

  showActivationStep: reads('repositories.isEmpty'),

  activateAllUrl: computed('owner.githubId', function () {
    const { githubId } = this.owner;
    return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  init() {
    this._super(...arguments);

    const { selectedRepositories, repositories } = this;
    if (repositories.length === 1) {
      selectedRepositories.addObjects(repositories);
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
      const { isAllSelected, repositories, selectedRepositories } = this;

      if (isAllSelected) {
        selectedRepositories.removeObjects(repositories.toArray());
      } else {
        selectedRepositories.addObjects(repositories.toArray());
      }
    }

  }

});
