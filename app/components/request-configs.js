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

  api: service(),
  flashes: service(),
  router: service(),

  status: 'closed',
  processing: false,
  mergeMode: 'deep_merge_append',
  repo: reads('request.repo'),
  closed: match('status', /closed/),
  customize: match('status', /customize/),
  replacing: match('mergeMode', /replace/),

  config: undefined,
  // strangely, if i use this instead of setting it manually later (in onCustomize)
  // the editor will show a blank canvas, and only render the config once it gets
  // clicked on
  // config: reads('request.apiConfig'),

  branch: reads('request.branchName'),
  sha: reads('request.commit.sha'),
  message: reads('request.commit.message'),

  displayTriggerBuild: computed(
    'repo.migrationStatus',
    'repo.permissions.create_request',
    'features.{enterpriseVersion,proVersion}',
    function () {
      let migrationStatus = this.get('repo.migrationStatus');
      let canTriggerBuild = this.get('repo.permissions.create_request');
      let enterprise = this.get('features.enterpriseVersion');
      let pro = this.get('features.proVersion');

      if (enterprise || pro) {
        return canTriggerBuild;
      }
      return canTriggerBuild && migrationStatus !== 'migrated';
    }
  ),

  searchBranches: task(function* (query) {
    const result = yield this.searchBranch.perform(this.get('repo.id'), query);
    return result.mapBy('name');
  }),

  rawConfigsCount: computed('request.rawConfigs', 'customize', function () {
    let configs = this.get('request.uniqRawConfigs');
    if (this.customize) {
      configs = configs.reject(config => config.source.includes('api'));
    }
    return configs.length;
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

  onCustomize: function () {
    if (this.status == 'open') {
      this.set('config', this.request.apiConfig);
      this.set('status', 'customize');
    } else if (this.status == 'customize') {
      this.set('status', 'open');
    }
  },

  onCancel: function () {
    if (this.status == 'open' || this.status == 'customize') {
      this.set('status', 'closed');
    }
  },

  configMode: computed('config', function () {
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

