import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import yaml from 'js-yaml';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  classNames: ['trigger-build-modal'],

  api: service(),
  flashes: service(),
  router: service(),

  triggerBuildBranch: '',
  triggerBuildMessage: '',
  triggerBuildConfig: '',

  onClose() {},

  keyboardShortcuts: {
    'esc': 'toggleTriggerBuildModal'
  },

  didInsertElement() {
    this._super(...arguments);
    this.set('triggerBuildBranch', this.get('repo.defaultBranch.name'));
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  createBuild: task(function* () {
    try {
      const body = this.buildTriggerRequestBody();
      return yield this.api.post(`/repo/${this.repo.id}/requests`, { data: body });
    } catch (e) {
      this.displayError(e);
    }
  }),

  triggerBuild: task(function* () {
    const data = yield this.createBuild.perform();

    if (data) {
      let requestId = data.request.id;

      let { triggerBuildRequestDelay } = config.intervals;
      yield timeout(triggerBuildRequestDelay);

      yield this.showRequestStatus.perform(this.repo.id, requestId);
    }
  }),

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
    let [build] = data.builds;

    if (build && result === 'approved') {
      return this.showBuild(build);
    } else if (result === 'rejected') {
      return this.showFailedRequest(requestId);
    }
    return this.showProcessingRequest(requestId);
  }),

  searchBranches: task(function* (query) {
    const searchResults = yield this.searchBranch.perform(this.repo.id, query);
    return searchResults.mapBy('name');
  }),

  buildTriggerRequestBody() {
    const { triggerBuildConfig, triggerBuildBranch: branch, triggerBuildMessage: message } = this;

    return {
      request: {
        branch,
        config: yaml.load(triggerBuildConfig),
        message: message || undefined
      }
    };
  },

  showProcessingRequest(requestId) {
    const preamble = 'Hold tight!';
    const notice = `You successfully triggered a build for ${this.repo.slug}. It might take a moment to show up though.`;
    this.flashes.notice(notice, preamble);
    this.onClose();
    return this.showRequest(requestId);
  },

  showFailedRequest(requestId) {
    const errorMsg = `You tried to trigger a build for ${this.repo.slug} but the request was rejected.`;
    this.flashes.error(errorMsg);
    this.onClose();
    return this.showRequest(requestId);
  },

  showRequest(requestId) {
    const queryParams = { requestId };
    return this.router.transitionTo('requests', this.repo, { queryParams });
  },

  showBuild(build) {
    this.onClose();
    return this.router.transitionTo('build', this.repo, build.id);
  },

  displayError(e) {
    let message;

    if (e.status === 429) {
      message = 'You’ve exceeded the limit for triggering builds, please wait a while before trying again.';
    } else if (e.message !== undefined && e.message === 'Unable to parse.') {
      message = `Oops, ${e.message} Parsed Line: ${e.parsedLine}, Snippet: ${e.snippet}`;
    } else {
      message = 'Oops, something went wrong, please try again.';
    }

    this.flashes.error(message);
    return this.onClose();
  },

  actions: {

    toggleTriggerBuildModal() {
      this.onClose();
    }

  }

});
