import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, notEmpty, or, not, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

import window from 'ember-window-mock';
import { task } from 'ember-concurrency';
import fetchAll from 'travis/utils/fetch-all';

const { appName, migrationRepositoryCountLimit } = config.githubApps;

export default Component.extend({
  features: service(),
  store: service(),
  externalLinks: service(),

  account: null,

  get migrationRepositoryCountLimit() {
    return migrationRepositoryCountLimit;
  },

  login: reads('account.login'),

  legacyRepositories: reads('account.legacyRepositories'),
  githubAppsRepositories: reads('account.githubAppsRepositories'),

  isEnterprise: reads('features.enterpriseVersion'),
  isNotEnterprise: not('isEnterprise'),
  isPro: reads('features.proVersion'),
  isNotPro: not('isPro'),
  hasGitHubAppsInstallation: notEmpty('account.installation'),

  isFilteringLegacyRepos: notEmpty('legacyRepositories.filter'),
  isFilteringAppsRepos: notEmpty('githubAppsRepositories.filter'),
  isLegacyReposFilterAllowed: and('legacyRepositories.length', 'features.repositoryFiltering'),
  isAppsReposFilterAllowed: and('githubAppsRepositories.length', 'features.repositoryFiltering'),

  showGitHubApps: reads('features.github-apps'),
  showPublicReposBanner: and('isNotEnterprise', 'isNotPro'),
  showLegacyReposFilter: or('isLegacyReposFilterAllowed', 'isFilteringLegacyRepos'),
  showAppsReposFilter: or('isAppsReposFilterAllowed', 'isFilteringAppsRepos'),

  githubAppsActivationURL: computed('account.githubId', function () {
    let githubId = this.get('account.githubId');
    return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  githubAppsManagementURL: computed(
    'account.{login,isOrganization,githubId}',
    'account.installation.githubId',
    function () {
      let login = this.get('account.login');
      let isOrganization = this.get('account.isOrganization');
      let accountGithubId = this.get('account.githubId');
      let installationGithubId = this.get('account.installation.githubId');

      if (appName && appName.length) {
        return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${accountGithubId}`;
      } else if (isOrganization) {
        return `https://github.com/organizations/${login}/settings/installations/${installationGithubId}`;
      } else {
        return `https://github.com/settings/installations/${installationGithubId}`;
      }
    }
  ),

  canMigrate: computed('hasGitHubAppsInstallation', 'deprecated.pagination.total', function () {
    let hasGitHubAppsInstallation = this.get('hasGitHubAppsInstallation');
    let legacyRepositoryCount = this.get('deprecated.pagination.total');
    const hasLegacyRepositories = legacyRepositoryCount > 0;
    const isAllowedByLimit = legacyRepositoryCount <= migrationRepositoryCountLimit;
    return !hasGitHubAppsInstallation && isAllowedByLimit && hasLegacyRepositories;
  }),

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
