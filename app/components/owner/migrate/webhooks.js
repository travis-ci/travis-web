import Component from '@ember/component';
import { computed } from '@ember/object';
import SelectableRepositoriesList from 'travis/mixins/components/selectable-repositories-list';
import config from 'travis/config/environment';

const SELECTION_LIMIT = 100;
const { appName = 'travis-ci' } = config.githubApps;

export default Component.extend(SelectableRepositoriesList, {
  selectionLimit: SELECTION_LIMIT,

  activateAllUrl: computed('owner.githubId', function () {
    const githubId = this.owner.githubId;
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

    activateRepos() {
      const { selectedRepositories, activateAllUrl: url } = this;
      const repos = selectedRepositories.map(repo => `repository_ids[]=${repo.githubId}`);
      window.location.href = `${url}&${repos.join('&')}`;
    }

  }

});
