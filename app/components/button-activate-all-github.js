import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

const { appName = 'travis-ci' } = config.githubApps;

export default Component.extend({
  tagName: '',

  accounts: service(),

  owner: reads('accounts.user'),
  githubId: reads('owner.githubId'),

  activateAllUrl: computed('githubId', function () {
    const { githubId } = this;
    return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  actions: {
    activateAll() {
      window.location.href = this.activateAllUrl;
    },
  },
});
