import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import YAML from 'npm:yamljs';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { filterBy, notEmpty } from 'ember-decorators/object/computed';

export default Component.extend({
  @service api: null,
  @service flashes: null,
  @service router: null,

  classNames: ['trigger-build-modal'],
  triggerBuildBranch: '',
  triggerBuildMessage: '',
  triggerBuildConfig: '',

  @filterBy('repo.branches', 'exists_on_github', true) branches: null,
  @notEmpty('triggerBuildMessage') triggerBuildMessagePresent: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('triggerBuildBranch', this.get('repo.defaultBranch.name'));
  },

  createBuild: task(function* () {
    try {
      const body = this.buildTriggerRequestBody();
      return yield this.get('api').post(`/repo/${this.get('repo.id')}/requests`, { data: body });
    } catch (e) {
      this.displayError(e);
    }
  }),

  triggerBuild: task(function* () {
    const data = yield this.get('createBuild').perform();

    if (data) {
      let requestId = data.request.id;

      let { triggerBuildRequestDelay } = config.intervals;
      yield timeout(triggerBuildRequestDelay);

      yield this.get('showRequestStatus').perform(this.get('repo.id'), requestId);
    }
  }),

  fetchBuildStatus: task(function* (repoId, requestId) {
    try {
      const url = `/repo/${repoId}/request/${requestId}`;
      return yield this.get('api').request(url);
    } catch (e) {
      this.displayError(e);
    }
  }),

  showRequestStatus: task(function* (repoId, requestId) {
    const data = yield this.get('fetchBuildStatus').perform(repoId, requestId);
    let { result } = data;
    let [build] = data.builds;

    if (build && result === 'approved') {
      return this.showBuild(build);
    } else if (result === 'rejected') {
      return this.showFailedRequest(requestId);
    }
    return this.showProcessingRequest(requestId);
  }),

  buildTriggerRequestBody() {
    let config = YAML.parse(this.get('triggerBuildConfig'));
    let body = {
      request: {
        branch: this.get('triggerBuildBranch'),
        config,
      }
    };

    if (this.get('triggerBuildMessagePresent')) {
      body.request.message = this.get('triggerBuildMessage');
    }

    return body;
  },

  showProcessingRequest(requestId) {
    const preamble = 'Hold tight!';
    const notice = `You successfully triggered a build
        for ${this.get('repo.slug')}. It might take a moment to show up though.`;
    this.get('flashes').notice(notice, preamble);
    this.get('onClose')();
    return this.showRequest(requestId);
  },

  showFailedRequest(requestId) {
    const errorMsg = `You tried to trigger a build
      for ${this.get('repo.slug')} but the request was rejected.`;
    this.get('flashes').error(errorMsg);
    this.get('onClose')();
    return this.showRequest(requestId);
  },

  showRequest(requestId) {
    const queryParams = { requestId };
    return this.get('router').transitionTo('requests', this.get('repo'), { queryParams });
  },

  showBuild(build) {
    this.get('onClose')();
    return this.get('router').transitionTo('build', this.get('repo'), build.id);
  },

  displayError(e) {
    let message;

    if (e.status === 429) {
      message =
        'You’ve exceeded the limit for triggering builds, please wait a while before trying again.';
    } else {
      message = 'Oops, something went wrong, please try again.';
    }

    this.get('flashes').error(message);
    return this.get('onClose')();
  },

  actions: {
    toggleTriggerBuildModal() {
      this.get('onClose')();
    }
  }
});
