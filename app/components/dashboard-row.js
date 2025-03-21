import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { capitalize } from '@ember/string';

export default Component.extend({
  permissionsService: service('permissions'),
  auth: service(),
  api: service(),
  flashes: service(),
  features: service(),

  tagName: '',

  isLoading: false,
  isTriggering: false,
  dropupIsOpen: false,

  canOwnerBuild: reads('repo.canOwnerBuild'),
  currentUser: alias('auth.currentUser'),
  userRoMode: reads('currentUser.roMode'),
  ownerRoMode: reads('repo.owner.ro_mode'),
  currentBuild: alias('repo.currentBuild'),
  scansEnabled: reads('features.logScanner'),

  displayMenuTofu: alias('repo.permissions.create_request'),

  repositoryProvider: computed('repo.provider', function () {
    return capitalize(this.repo.provider);
  }),

  repositoryType: computed('repo.serverType', function () {
    switch (this.repo.serverType) {
      case 'git':
        return 'GIT';
      case 'subversion':
        return 'SVN';
      case 'perforce':
        return 'P4';
    }
  }),

  openDropup() {
    this.set('dropupIsOpen', true);
  },

  closeDropup() {
    this.set('dropupIsOpen', false);
  },

  fetchBuildStatus: task(function* (repoId, requestId) {
    try {
      return yield this.api.get(`/repo/${repoId}/request/${requestId}`);
    } catch (e) {
      this.displayError(e);
    }
  }),

  showRequestStatus: task(function* (repoId, requestId) {
    const data = yield this.fetchBuildStatus.perform(repoId, requestId);
    let { result } = data;

    if (result === 'rejected') {
      return this.showFailedRequest(requestId);
    }

    return this.showProcessingRequest(requestId);
  }),

  createBuild: task(function* () {
    try {
      this.set('isTriggering', false);
      let data = {};
      data.request = `{ 'branch': '${this.get('repo.defaultBranch.name')}' }`;
      return yield this.api.post(`/repo/${this.repo.id}/requests`, { data: data });
    } catch (e) {
      this.displayError(e);
    }
  }),

  showProcessingRequest(requestId) {
    const preamble = 'Hold tight!';
    const notice = `You successfully triggered a build for ${this.repo.slug}. It might take a moment to show up though.`;
    this.flashes.warning(notice, preamble);
  },

  showFailedRequest(requestId) {
    const errorMsg = `You tried to trigger a build for ${this.repo.slug} but the request was rejected.`;
    this.flashes.error(errorMsg);
  },

  triggerBuild: task(function* () {
    const data = yield this.createBuild.perform();

    if (data && data.request) {
      let requestId = data.request.id;

      let { triggerBuildRequestDelay } = config.intervals;
      yield timeout(triggerBuildRequestDelay);

      yield this.showRequestStatus.perform(this.repo.id, requestId);
    }
    this.set('isTriggering', false);
    this.set('dropupIsOpen', false);
  }),

  displayError(e) {
    let message;

    if (e.status === 429) {
      message = 'You’ve exceeded the limit for triggering builds, please wait a while before trying again.';
    } else {
      message = 'Oops, something went wrong, please try again.';
    }

    this.flashes.error(message);
  },

  actions: {
    openDropup() {
      this.openDropup();
    },

    triggerBuild() {
      this.triggerBuild.perform();
    },

    starRepo() {
      if (this.get('repo.starred')) {
        this.unstar.perform(this.repo);
      } else {
        this.star.perform(this.repo);
      }
    }
  }
});
