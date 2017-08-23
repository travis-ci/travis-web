import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import YAML from 'npm:yamljs';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { filterBy, notEmpty } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @service ajax: null,
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
      return yield this.get('ajax').postV3(`/repo/${this.get('repo.id')}/requests`, body);
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

      this.get('showRequestStatus').perform(this.get('repo.id'), requestId);
    }
  }),

  fetchBuildStatus: task(function* (repoId, requestId) {
    try {
      const url = `/repo/${repoId}/request/${requestId}`;
      const headers = {
        'Travis-API-Version': '3'
      };
      return yield this.get('ajax').ajax(url, 'GET', { headers });
    } catch (e) {
      this.displayError(e);
    }
  }),

  showRequestStatus: task(function* (repoId, requestId) {
    const data = yield this.get('fetchBuildStatus').perform(repoId, requestId);
    let { result } = data;
    let build = data.builds.firstObject;

    if (build && result === 'approved') {
      return this.showBuild(build);
    } else if (result === 'rejected') {
      return this.showFailedRequest(requestId);
    }
    return this.showProcessingRequest(requestId);
  }),

  buildTriggerRequestBody() {
    let requestConfig = YAML.parse(this.get('triggerBuildConfig'));
    let body = {
      request: {
        branch: this.get('triggerBuildBranch'),
        requestConfig,
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
    this.get('flashes').error('Oops, something went wrong, please try again.');
    return this.get('onClose')();
  },

  actions: {
    toggleTriggerBuildModal() {
      this.get('onClose')();
    }
  }
});
