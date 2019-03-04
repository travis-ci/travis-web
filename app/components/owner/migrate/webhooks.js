import Component from '@ember/component';
import { computed } from '@ember/object';
import SelectableRepositoriesList from 'travis/mixins/components/selectable-repositories-list';
import config from 'travis/config/environment';

const { appName = 'travis-ci' } = config.githubApps;

export default Component.extend(SelectableRepositoriesList, {

  activateAllUrl: computed('owner.githubId', function () {
    const githubId = this.owner.githubId;
    const url = `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
    return url;
  }),

  init() {
    this._super(...arguments);

    const { selectedRepositories, repositories } = this;
    if (repositories.length === 1) {
      selectedRepositories.addObjects(repositories);
    }
  }

});
