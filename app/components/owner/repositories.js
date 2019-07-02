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

  owner: null,

  login: reads('owner.login'),

  hasGitHubAppsInstallation: notEmpty('owner.installation'),

  isEnterprise: reads('features.enterpriseVersion'),
  isNotEnterprise: not('isEnterprise'),
  isPro: reads('features.proVersion'),
  isNotPro: not('isPro'),
  isAppsEnabled: reads('features.github-apps'),
  isNotAppsEnabled: not('isAppsEnabled'),
  isFilteringEnabled: reads('features.repositoryFiltering'),
  isLoadingBetaRequests: reads('owner.fetchBetaMigrationRequestsTask.isRunning'),
  isNotLoadingBetaRequests: not('isLoadingBetaRequests'),

  get migrationRepositoryCountLimit() {
    return migrationRepositoryCountLimit;
  },

  legacyRepos: reads('owner.legacyRepositories'),
  legacyReposCount: reads('legacyRepos.total'),
  isFilteringLegacyRepos: notEmpty('legacyRepos.filterTerm'),
  hasLegacyRepos: bool('legacyReposCount'),
  isLoadingLegacyRepos: reads('legacyRepos.isLoading'),
  shouldShowLegacyReposFilter: or('hasLegacyRepos', 'isFilteringLegacyRepos', 'isLoadingLegacyRepos'),

  appsRepos: reads('owner.githubAppsRepositories'),
  appsReposCount: reads('appsRepos.total'),
  isFilteringAppsRepos: notEmpty('appsRepos.filterTerm'),
  hasAppsRepos: bool('appsReposCount'),
  isLoadingAppsRepos: reads('appsRepos.isLoading'),
  shouldShowAppsReposFilter: or('hasAppsRepos', 'isFilteringAppsRepos', 'isLoadingAppsRepos'),

  appsReposOnOrg: reads('owner.githubAppsRepositoriesOnOrg'),

  showGitHubApps: reads('isAppsEnabled'),
  showMigrationStatusBanner: and('isNotEnterprise', 'isNotPro', 'isNotLoadingBetaRequests'),
  showLegacyReposFilter: or('isFilteringEnabled', 'shouldShowLegacyReposFilter'),
  showAppsReposFilter: and('isFilteringEnabled', 'shouldShowAppsReposFilter'),
  showLegacyRepos: or('hasLegacyRepos', 'isLoadingLegacyRepos', 'isFilteringLegacyRepos', 'isNotAppsEnabled'),

  migrateURL: computed('owner.type', 'owner.login', function () {
    const { login, isUser } = this.owner;
    const path = isUser ? 'account/migrate' : `organizations/${login}/migrate`;
    return `https://travis-ci.com/${path}`;
  }),

  appsActivationURL: computed('owner.githubId', function () {
    let githubId = this.get('owner.githubId');
    return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  appsManagementURL: computed(
    'owner.{login,isOrganization,githubId}',
    'owner.installation.githubId',
    function () {
      let login = this.get('owner.login');
      let isOrganization = this.get('owner.isOrganization');
      let ownerGithubId = this.get('owner.githubId');
      let installationGithubId = this.get('owner.installation.githubId');

      if (appName && appName.length) {
        return `https://github.com/apps/${appName}/installations/new/permissions?suggested_target_id=${ownerGithubId}`;
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
        owner: this.owner.login,
        type: 'byOwner',
      },
    };

    let repositories = yield this.store.paginated('repo', queryParams, { live: false }) || [];

    yield fetchAll(this.store, 'repo', queryParams);

    let githubQueryParams = repositories.map(repo => `repository_ids[]=${repo.githubId}`).join('&');

    window.location.href =
      `https://github.com/apps/${appName}/installations/new/permissions` +
      `?suggested_target_id=${this.owner.githubId}&${githubQueryParams}`;
  })
});
