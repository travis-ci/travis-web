import { computed, action } from 'ember-decorators/object';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

import window from 'ember-window-mock';
import { task } from 'ember-concurrency';
import fetchAll from 'travis/utils/fetch-all';

import { alias, filter, filterBy } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service features: null,
  @service store: null,

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

  @computed('account.login', 'account.installation.githubId')
  githubAppsManagementURL(login, installationGithubId) {
    return `https://github.com/organizations/${login}/settings/installations/${installationGithubId}`;
  },

  @computed('account.id')
  hasGitHubAppsInstallation(installationId) {
    // FIXME this is trying to not access the installation if it doesn’t exist
    return !!this.get('account').belongsTo('installation').id();
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

  migrate: task(function* () {
    // FIXME this is adapted from routes/account/repositories

    let queryParams = {
      sort_by: 'name',
      'repository.managed_by_installation': false,
      custom: {
        owner: this.get('account.login'),
        type: 'byOwner',
      },
    };

    let repositories = yield this.store.paginated(
      'repo',
      queryParams,
      { live: false }
    );

    yield fetchAll(this.get('store'), 'repo', queryParams);

    let githubQueryParams =
      repositories.map(repo => `repository_ids[]=${repo.get('id')}`).join('&');

    window.location.href =
      `https://github.com/apps/${this.get('githubAppsAppName')}/installations/new/permissions` +
      `?suggested_target_id=${this.get('account.githubId')}&${githubQueryParams}`;
  })
});
