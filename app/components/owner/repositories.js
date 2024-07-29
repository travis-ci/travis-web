import Component from '@ember/component';
import { computed } from '@ember/object';
import {
  match,
  reads,
  empty,
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

const { providers } = config;
const { appName, migrationRepositoryCountLimit } = config.githubApps;

import { isPresent } from '@ember/utils';

export default Component.extend({
  features: service(),
  store: service(),
  storage: service(),
  wizard: service('wizard-state'),

  owner: null,

  login: reads('owner.login'),

  skipGitHubAppsInstallation: or('isNotGithubRepository', 'hasGitHubAppsInstallation'),
  isGithubRepository: or('isOwnerVcsTypeEmpty', 'isMatchGithub'),
  isMatchGithub: match('owner.vcsType', /Github\S+$/),
  isOwnerVcsTypeEmpty: empty('owner.vcsType'),
  isNotGithubRepository: not('isGithubRepository'),
  hasGitHubAppsInstallation: computed(function () {
    return this.owner && this.owner.installation;
  }),

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

  appsRepos: computed('owner.githubAppsRepositories', function () {
    this.owner.githubAppsRepositories.reload();
    return this.owner.githubAppsRepositories;
  }),
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

  wizardStep: reads('storage.wizardStep'),
  wizardState: reads('wizard.state'),

  showWizard: computed('wizardStep', {
    get() {
      if (isPresent(this._showWizard)) {
        return this._showWizard;
      }

      let state = this.wizardStep;

      return state && state <= 3;
    },
    set(k, v) {
      this.set('_showWizard', v);
      return this._showWizard;
    }
  }),


  appsActivationURL: computed('owner.githubId', function () {
    let githubId = this.get('owner.githubId');
    return `${config.githubAppsEndpoint}/${appName}/installations/new/permissions?suggested_target_id=${githubId}`;
  }),

  appsManagementURL: computed(
    'owner.{login,isOrganization,githubId}',
    'owner.installation.githubId',
    function () {
      let login = this.get('owner.login');
      let isOrganization = this.get('owner.isOrganization');
      let ownerGithubId = this.get('owner.githubId');
      let installationGithubId = this.get('owner.installation.githubId');
      let sourceEndpoint = `${config.sourceEndpoint}`;

      if (sourceEndpoint === 'undefined') {
        sourceEndpoint = 'https://github.com';
      }

      if (!installationGithubId) {
        let ownerId = this.get('owner.id');
        let ownerType = this.get('owner.type');
        const installations = this.store.peekAll('installation').filterBy('owner.id', ownerId) || null;
        if (installations) {
          const installation = installations.findBy('owner.type', ownerType) || null;
          if (installation) {
            installationGithubId = installation.githubId;
          }
        }
      }

      if (!installationGithubId && appName && appName.length) {
        return `${config.githubAppsEndpoint}/${appName}/installations/new/permissions?suggested_target_id=${ownerGithubId}`;
      } else if (isOrganization) {
        return `${sourceEndpoint}/organizations/${login}/settings/installations/${installationGithubId}`;
      } else {
        return `${sourceEndpoint}/settings/installations/${installationGithubId}`;
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
    let queryParams = {
      provider: providers.github.urlPrefix,
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
      `${config.githubAppsEndpoint}/${appName}/installations/new/permissions` +
      `?suggested_target_id=${this.owner.githubId}&${githubQueryParams}`;
  }),

  closeWizard: task(function* () {
    this.set('showWizard', false);
    yield this.wizard.delete.perform();
  }).drop(),

  reloadRepositories: task(function* () {
    if (this.hasAppsRepos) {
      yield this.appsRepos.content.forEach(element => {
        element.reload();
      });
    }
    if (this.hasLegacyRepos) {
      yield this.legacyRepos.content.forEach(element => {
        element.reload();
      });
    }
  }),

  actions: {
    onWizardClose() {
      this.closeWizard.perform();
    },
    subscribe() {
      if (!this.owner.unsubscribe.isRunning) {
        this.owner.subscribe.perform().then(() => {
          this.reloadRepositories.perform();
        });
      }
    },

    unsubscribe() {
      if (!this.owner.subscribe.isRunning) {
        this.owner.unsubscribe.perform().then(() => {
          this.reloadRepositories.perform();
        });
      }
    }
  }
});
