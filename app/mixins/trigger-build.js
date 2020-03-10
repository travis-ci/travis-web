import Mixin from '@ember/object/mixin';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Mixin.create({
  api: service(),
  flashes: service(),
  router: service(),

  submitBuildRequest: task(function* () {
    const data = yield this.createBuild.perform();

    if (data) {
      let requestId = data.request.id;
      let { searchDebounceRate } = config.intervals;
      yield timeout(searchDebounceRate);
      yield this.showRequestStatus.perform(this.get('repo.id'), requestId);
    }
  }),

  createBuild: task(function* () {
    try {
      const data = {
        request: {
          branch: this.branch,
          sha: this.sha,
          config: this.config,
          message: this.message,
          merge_mode: this.mergeMode
        }
      };
      return yield this.api.post(`/repo/${this.get('repo.id')}/requests`, { data: data });
    } catch (e) {
      this.displayError(e);
    }
  }),

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
