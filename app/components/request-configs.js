import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, match } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  tagName: 'div',
  classNames: ['request-configs'],
  classNameBindings: ['status', 'processing'],

  repo: reads('request.repo'),
  status: 'closed',
  processing: false,
  closed: match('status', /closed/),
  replacing: match('mergeMode', /replace/),

  branch: reads('request.repo.defaultBranch.name'),
  sha: reads('request.commit.sha'),
  message: reads('request.commit.message'),
  config: undefined,
  mergeMode: 'deep_merge_append',

  api: service(),
  flashes: service(),
  router: service(),

  searchBranches: task(function* (query) {
    const result = yield this.searchBranch.perform(this.get('repo.id'), query);
    return result.mapBy('name');
  }),

  onTriggerBuild: function (e) {
    e.toElement.blur();
    if (this.status == 'closed') {
      this.set('status', 'open');
    } else if (this.status == 'open' || this.status == 'customize') {
      this.set('processing', true);
      this.triggerBuild.perform();
    }
  },

  onCancel: function () {
    if (this.status == 'open' || this.status == 'customize') {
      this.set('status', 'closed');
    }
  },

  onCustomize: function () {
    if (this.status == 'open') {
      this.set('status', 'customize');
      if (typeof this.config === 'undefined') {
        this.set('config', this.get('apiConfig'));
      }
    } else if (this.status == 'customize') {
      this.set('status', 'open');
    }
  },

  configMode: computed('config', function () {
    console.log(this.config);
    if (this.config && this.config[0] == '{') {
      return 'javascript';
    } else {
      return 'yaml';
    }
  }),

  configType: computed('configMode', function () {
    if (this.configMode == 'javascript') {
      return 'JSON';
    } else {
      return 'YAML';
    }
  }),

  apiConfig: computed('request.rawConfigs', function () {
    const config = this.get('request.uniqRawConfigs').find((config) => config.source.includes('api'));
    if (config && config.config != '{}') {
      return config.config;
    }
  }),

  triggerBuild: task(function* () {
    const data = yield this.createBuild.perform();

    if (data) {
      let requestId = data.request.id;
      let { delay } = config.intervals;
      yield timeout(delay);
      yield this.showRequestStatus.perform(this.get('repo.id'), requestId);
    }
  }),

  createBuild: task(function* () {
    try {
      const body = this.requestBody();
      return yield this.api.post(`/repo/${this.get('repo.id')}/requests`, { data: body });
    } catch (e) {
      this.displayError(e);
    }
  }),

  requestBody() {
    const { branch, sha, config, message, mergeMode } = this;

    return {
      request: {
        branch,
        sha,
        config,
        message,
        merge_mode: mergeMode
      }
    };
  },

  showRequestStatus: task(function* (repoId, requestId) {
    const data = yield this.buildStatus.perform(repoId, requestId);
    let { result } = data;
    let [build] = data.builds;

    if (build && result === 'approved') {
      return this.showBuild(build);
    } else if (result === 'rejected') {
      return this.showFailedRequest(requestId);
    }
    return this.showProcessingRequest(requestId);
  }),

  buildStatus: task(function* (repoId, requestId) {
    try {
      return yield this.api.get(`/repo/${repoId}/request/${requestId}`);
    } catch (e) {
      this.displayError(e);
    }
  }),

  showProcessingRequest(requestId) {
    const preamble = 'Hold tight!';
    const notice = `You successfully triggered a build for ${this.get('repo.slug')}. It might take a moment to show up though.`;
    this.flashes.notice(notice, preamble);
    return this.showRequest(requestId);
  },

  showFailedRequest(requestId) {
    const errorMsg = `You tried to trigger a build for ${this.get('repo.slug')} but the request was rejected.`;
    this.flashes.error(errorMsg);
    return this.showRequest(requestId);
  },

  showRequest(requestId) {
    const queryParams = { requestId };
    return this.router.transitionTo('requests', this.repo, { queryParams });
  },

  showBuild(build) {
    return this.router.transitionTo('build', this.repo, build.id);
  },

  displayError(e) {
    let message;

    if (e.status === 429) {
      message = 'You’ve exceeded the limit for triggering builds, please wait a while before trying again.';
    } else {
      message = 'Oops, something went wrong, please try again.';
    }

    this.flashes.error(message);
  },
});
