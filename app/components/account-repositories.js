import Component from '@ember/component';
import { computed, action } from 'ember-decorators/object';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

import window from 'ember-window-mock';
import { task } from 'ember-concurrency';
import fetchAll from 'travis/utils/fetch-all';

import { reads, sort, notEmpty } from '@ember/object/computed';

const { appName, migrationRepositoryCountLimit } = config.githubApps;

export default Component.extend({
  features: service(),
  store: service(),
  externalLinks: service(),

  page: 1,
  appsPage: 1,
  appsOrgPage: 1,

  login: '',
  account: null,
  deprecated: null,
  lockedGithubAppsRepositories: null,
  notLockedGithubAppsRepositories: null,

  get migrationRepositoryCountLimit() {
    return migrationRepositoryCountLimit;
  },

  deprecatedSorting: ['name'],
  sortedRepositories: sort('deprecated', 'deprecatedSorting'),
  showGitHubApps: reads('features.github-apps'),

  @computed('account.githubId')
  githubAppsActivationURL(githubId) {
    return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  },

  @computed('account.{login,isOrganization,githubId}', 'account.installation.githubId')
  githubAppsManagementURL(login, isOrganization, accountGithubId, installationGithubId) {
    if (appName && appName.length) {
      return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${accountGithubId}`;
    } else if (isOrganization) {
      return `https://github.com/organizations/${login}/settings/installations/${installationGithubId}`;
    } else {
      return `https://github.com/settings/installations/${installationGithubId}`;
    }
  },

  hasGitHubAppsInstallation: notEmpty('account.installation'),

  @computed('hasGitHubAppsInstallation', 'deprecated.pagination.total')
  canMigrate(hasGitHubAppsInstallation, legacyRepositoryCount) {
    const hasLegacyRepositories = legacyRepositoryCount > 0;
    const isAllowedByLimit = legacyRepositoryCount <= migrationRepositoryCountLimit;
    return !hasGitHubAppsInstallation && isAllowedByLimit && hasLegacyRepositories;
  },

  @action
  filterQuery(query) {
    let params = {
      name_filter: query,
      'repository.managed_by_installation': false,
      sort_by: 'name_filter:desc',
      limit: 10,
      custom: {
        owner: this.login,
        type: 'byOwner',
      },
    };

    if (this.showGitHubApps) {
      params.active = true;
    }

    return this.store.query('repo', params);
  },

  @action
  filterQueryGitHubApps(query) {
    return this.store.query('repo', {
      name_filter: query,
      'repository.managed_by_installation': true,
      'repository.active_on_org': false,
      sort_by: 'name_filter:desc',
      limit: 10,
      custom: {
        owner: this.login,
        type: 'byOwner',
      },
    });
  },

  migrate: task(function* () {
    let queryParams = {
      sort_by: 'name',
      'repository.managed_by_installation': false,
      'repository.active': true,
      custom: {
        owner: this.account.login,
        type: 'byOwner',
      },
    };

    let repositories = yield this.store.paginated('repo', queryParams, { live: false }) || [];

    yield fetchAll(this.store, 'repo', queryParams);

    let githubQueryParams = repositories.map(repo => `repository_ids[]=${repo.githubId}`).join('&');

    window.location.href =
      `https://github.com/apps/${appName}/installations/new/permissions` +
      `?suggested_target_id=${this.account.githubId}&${githubQueryParams}`;
  })
});
