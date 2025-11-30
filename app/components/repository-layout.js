import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';
import { capitalize } from  '@ember/string';

export default Component.extend({
  auth: service(),
  externalLinks: service(),
  features: service(),
  storage: service(),
  flashes: service(),
  isProVersion: reads('features.proVersion'),
  isShowingTriggerBuildModal: false,
  isShowingStatusBadgeModal: false,
  currentUser: alias('auth.currentUser'),
  userRoMode: reads('currentUser.roMode'),
  scansEnabled: reads('features.logScanner'),

  repositoryProvider: computed('repo.provider', function () {
    return capitalize(this.repo.provider);
  }),

  repositoryType: computed('repo.serverType', function () {
    console.log('repo serverType:', this.repo.serverType);
    switch (this.repo.serverType) {
      case 'git':
        return 'GIT';
      case 'svn':
        return 'SVN';
      case 'perforce':
        return 'P4';
    }
  }),

  repoUrl: computed('repo.{ownerName,slug,vcsName,vcsType}', function () {
    const owner = this.get('repo.ownerName');
    const repo = this.get('repo.vcsName');
    const vcsType = this.get('repo.vcsType');
    const vcsId = this.get('repo.vcsId');
    const slugOwner = this.get('repo.slug').split('/')[0];

    return this.externalLinks.repoUrl(vcsType, { owner, repo, vcsId, slugOwner });
  }),

  orgBuildHistoryLink: computed('repo.slug', function () {
    const slug = this.get('repo.slug');

    return this.externalLinks.orgBuildHistoryLink(slug);
  }),

  comBuildHistoryLink: computed('repo.slug', function () {
    const slug = this.get('repo.slug');

    return this.externalLinks.comBuildHistoryLink(slug);
  }),

  actions: {
    toggleStatusBadgeModal() {
      this.toggleProperty('isShowingStatusBadgeModal');
    },
    toggleTriggerBuildModal() {
      this.toggleProperty('isShowingTriggerBuildModal');
    }
  },

  didRender() {
    const repo = this.get('repo');

    if (repo.hasBuildBackups === undefined) {
      repo.fetchInitialBuildBackups.perform();
    }

    const allowance = repo.get('allowance');
    const ownerRoMode = repo.get('owner').ro_mode || false;

    if (this.shouldShowLicenseWarning(repo, allowance)) {
      const isUser = repo.ownerType === 'user';
      if (allowance.get('pendingUserLicenses')) {
        this.flashes.custom('flashes/pending-user-licenses', { owner: repo.owner, isUser: isUser }, 'pending-user-licenses');
      } else if (!allowance.get('userUsage')) {
        this.flashes.custom('flashes/users-limit-exceeded', { owner: repo.owner, isUser: isUser }, 'users-limit-exceeded');
      }
    } else if (this.userRoMode && ownerRoMode) {
      this.flashes.custom('flashes/read-only-mode', {}, 'read-only-mode');
    }
  },

  shouldShowLicenseWarning(repo, allowance) {
    const METERED_PLAN = 3;
    const user = this.auth.currentUser;
    const isUserConfirmed = user && user.confirmedAt;
    const isNotMeteredPlan = allowance && allowance.get('subscriptionType') !== METERED_PLAN;

    return this.isProVersion &&
      allowance &&
      !repo.canOwnerBuild &&
      isUserConfirmed &&
      isNotMeteredPlan;
  }
});
