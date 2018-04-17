import { computed, action } from 'ember-decorators/object';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

import { alias, filter, filterBy } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service features: null,

  page: 1,

  @computed('model.deprecated')
  sortedRepositories(repos) {
    return repos.sortBy('name');
  },

  showGitHubApps: config.githubApps,
  config,
  @alias('config.githubApps.appName') githubAppsAppName: null,

  @computed('githubAppsAppName', 'account.githubId')
  githubAppsActivationURL(appName, githubId) {
    return 'https://github.com/apps/' +
      `${appName}/installations/new/permissions?target_id=${githubId}`;
  },

  @computed('account.login', 'githubAppsInstallationId')
  githubAppsManagementURL(login, installationId) {
    return `https://github.com/organizations/${login}/settings/installations/${installationId}`;
  },

  @computed('account.id')
  githubAppsInstallationId() {
    return this.get('account').belongsTo('installation').id();
  },

  @computed('githubAppsInstallationId')
  hasGitHubAppsInstallation(installationId) {
    return !!installationId;
  },

  @filterBy('model.githubApps', 'active_on_org')
  lockedGithubAppsRepositories: null,

  @filter('model.githubApps', repo => !repo.get('active_on_org'))
  notLockedGithubAppsRepositories: null,

  @action
  filterQuery(query) {
    return this.get('store')
      .query('repo', {
        slug_filter: query,
        sort_by: 'slug_filter:desc',
        limit: 10,
        custom: {
          owner: this.get('login'),
          type: 'byOwner',
        },
      });
  },
});
