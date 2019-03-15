import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, notEmpty, or, not, and, bool } from '@ember/object/computed';
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

  login: reads('account.login'),

  hasGitHubAppsInstallation: notEmpty('account.installation'),

  isEnterprise: reads('features.enterpriseVersion'),
  isNotEnterprise: not('isEnterprise'),
  isPro: reads('features.proVersion'),
  isNotPro: not('isPro'),
  isAppsEnabled: reads('features.github-apps'),
  isNotAppsEnabled: not('isAppsEnabled'),
  isLegacyReposFilterAllowed: reads('features.repositoryFiltering'),
  isAppsReposFilterAllowed: reads('features.repositoryFiltering'),

  get migrationRepositoryCountLimit() {
    return migrationRepositoryCountLimit;
  },

  legacyRepos: reads('account.legacyRepositories'),
  legacyReposCount: reads('legacyRepos.total'),
  isFilteringLegacyRepos: notEmpty('legacyRepos.filter'),
  hasLegacyRepos: bool('legacyReposCount'),
  isLoadingLegacyRepos: reads('legacyRepos.isLoading'),

  appsRepos: reads('account.githubAppsRepositories'),
  appsReposCount: reads('appsRepos.total'),
  isFilteringAppsRepos: notEmpty('appsRepos.filter'),
  hasAppsRepos: bool('appsReposCount'),
  isLoadingAppsRepos: reads('appsRepos.isLoading'),

  appsReposOnOrg: reads('account.githubAppsRepositoriesOnOrg'),

  showGitHubApps: reads('isAppsEnabled'),
  showPublicReposBanner: and('isNotEnterprise', 'isNotPro'),
  showLegacyReposFilter: or('isLegacyReposFilterAllowed', 'isFilteringLegacyRepos', 'isLoadingLegacyRepos'),
  showAppsReposFilter: or('isAppsReposFilterAllowed', 'isFilteringAppsRepos', 'isLoadingAppsRepos'),
  showLegacyRepos: or('hasLegacyRepos', 'isLoadingLegacyRepos', 'isFilteringLegacyRepos', 'isNotAppsEnabled'),

  appsActivationURL: computed('account.githubId', function () {
    let githubId = this.get('account.githubId');
    return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  appsManagementURL: computed(
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

  canMigrate: computed('hasGitHubAppsInstallation', 'legacyRepos.total', function () {
    let hasGitHubAppsInstallation = this.get('hasGitHubAppsInstallation');
    let legacyRepositoryCount = this.get('legacyRepos.total');
    const hasLegacyRepos = legacyRepositoryCount > 0;
    const isAllowedByLimit = legacyRepositoryCount <= migrationRepositoryCountLimit;
    return !hasGitHubAppsInstallation && isAllowedByLimit && hasLegacyRepos;
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
