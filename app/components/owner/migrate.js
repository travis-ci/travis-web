import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import config from 'travis/config/environment';

const { appName = 'travis-ci' } = config.githubApps;

export default Component.extend({

  owner: null,

  repositories: reads('owner.githubAppsRepositoriesOnOrg'),

  showActivationStep: reads('repositories.isEmpty'),

  activateAllUrl: computed('owner.githubId', function () {
    const { githubId } = this.owner;
    return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  actions: {

    activateAll() {
      window.location.href = this.activateAllUrl;
    }

  }

});
