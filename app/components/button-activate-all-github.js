import Component from '@ember/component';
import { computed } from '@ember/object';
import { bool, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

const { appName = 'travis-ci' } = config.githubApps;

export default Component.extend({
  tagName: '',

  accounts: service(),

  owner: reads('accounts.user'),
  githubId: reads('owner.githubId'),
  isVisible: bool('githubId'),

  activateAllUrl: computed('githubId', function () {
    const { githubId } = this;
    return `${config.githubAppsEndpoint}/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  actions: {
    activateAll() {
      window.location.href = this.activateAllUrl;
    },
  },
});
