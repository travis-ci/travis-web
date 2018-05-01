import { computed, action } from 'ember-decorators/object';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

import window from 'ember-window-mock';
import { task } from 'ember-concurrency';
import fetchAll from 'travis/utils/fetch-all';

import { alias } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service features: null,
  @service store: null,

  page: 1,
  'apps-page': 1,
  'apps-org-page': 1,

  @computed('model.deprecated')
  sortedRepositories(repos) {
    return repos.sortBy('name');
  },

  @alias('features.github-apps') showGitHubApps: null,

  config,
  @alias('config.githubApps.appName') githubAppsAppName: null,

  @computed('githubAppsAppName', 'account.githubId')
  githubAppsActivationURL(appName, githubId) {
    return 'https://github.com/apps/' +
      `${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  },

  @computed('account.login', 'account.installation.githubId', 'account.type')
  githubAppsManagementURL(login, installationGithubId, accountType) {
    if (accountType === 'organization') {
      return `https://github.com/organizations/${login}/settings/installations/${installationGithubId}`;
    } else {
      return `https://github.com/settings/installations/${installationGithubId}`;
    }
  },

  @computed('account.id')
  hasGitHubAppsInstallation(installationId) {
    // FIXME this is trying to not access the installation if it doesn’t exist
    return !!this.get('account').belongsTo('installation').id();
  },

  @action
  filterQuery(query) {
    let params = {
      name_filter: query,
      'repository.managed_by_installation': false,
      sort_by: 'name_filter:desc',
      limit: 10,
      custom: {
        owner: this.get('login'),
        type: 'byOwner',
      },
    };

    if (this.get('showGitHubApps')) {
      params.active = true;
    }

    return this.get('store')
      .query('repo', params);
  },

  @action
  filterQueryGitHubApps(query) {
    return this.get('store')
      .query('repo', {
        name_filter: query,
        'repository.managed_by_installation': true,
        'repository.active_on_org': false,
        sort_by: 'name_filter:desc',
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
      'repository.active': true,
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
      repositories.map(repo => `repository_ids[]=${repo.get('githubId')}`).join('&');

    window.location.href =
      `https://github.com/apps/${this.get('githubAppsAppName')}/installations/new/permissions` +
      `?suggested_target_id=${this.get('account.githubId')}&${githubQueryParams}`;
  })
});
