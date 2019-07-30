import Component from '@ember/component';
import { computed } from '@ember/object';
import {
  reads,
  notEmpty,
  or,
  not,
  and,
  bool
} from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

import window from 'ember-window-mock';
import { task } from 'ember-concurrency';
import fetchAll from 'travis/utils/fetch-all';
import vcsLinks from 'travis/utils/vcs-links';

const { appName, migrationRepositoryCountLimit } = config.githubApps;

export default Component.extend({
  features: service(),
  store: service(),

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

  appsActivationURL: computed('owner.{githubId,vcsType,vcsId}', function () {
    const vcsId = this.get('owner.vcsId') || this.get('owner.githubId');
    const vcsType = this.get('owner.vcsType');

    return vcsLinks.appsActivationUrl(vcsType, appName, vcsId);
  }),

  appsManagementURL: computed(
    'owner.{login,isOrganization,githubId,vcsType,vcsId}',
    'owner.installation.githubId',
    function () {
      const login = this.get('owner.login');
      const isOrganization = this.get('owner.isOrganization');
      const vcsType = this.get('owner.vcsType');
      const vcsId = this.get('owner.vcsId') || this.get('owner.githubId');
      const installationGithubId = this.get('owner.installation.githubId');

      if (appName && appName.length) {
        return vcsLinks.appsActivationUrl(vcsType, appName, vcsId);
      } else if (isOrganization) {
        return `https://github.com/organizations/${login}/settings/installations/${installationGithubId}`;
      } else {
        return `https://github.com/settings/installations/${installationGithubId}`;
      }
    }
  ),

  canMigrate: computed('hasGitHubAppsInstallation', 'legacyRepos.total', function () {
    let hasGitHubAppsInstallation = this.hasGitHubAppsInstallation;
    let legacyRepositoryCount = this.get('legacyRepos.total');
    const hasLegacyRepos = legacyRepositoryCount > 0;
    const isAllowedByLimit = legacyRepositoryCount <= migrationRepositoryCountLimit;
    return !hasGitHubAppsInstallation && isAllowedByLimit && hasLegacyRepos;
  }),

  migrate: task(function* () {
    const queryParams = {
      sort_by: 'name',
      'repository.managed_by_installation': false,
      'repository.active': true,
      custom: {
        owner: this.owner.login,
        type: 'byOwner',
      },
    };

    const repositories = yield this.store.paginated('repo', queryParams, { live: false }) || [];

    yield fetchAll(this.store, 'repo', queryParams);

    const githubQueryParams = repositories.map(repo => `repository_ids[]=${repo.githubId}`).join('&');
    const vcsId = this.owner.vcsId || this.owner.githubId;
    const vcsType = this.owner.vcsType;

    window.location.href = `${vcsLinks.appsActivationUrl(vcsType, appName, vcsId)}&${githubQueryParams}`;
  })
});
