import Ember from 'ember';
import { task } from 'ember-concurrency';
import YAML from 'npm:yamljs';
import config from 'travis/config/environment';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service ajax: null,
  @service flashes: null,
  @service router: null,

  classNames: ['trigger-build-modal'],
  triggerBuildBranch: '',
  triggerBuildMessage: '',
  triggerBuildConfig: '',
  isTriggering: false,

  branches: Ember.computed.filterBy('repo.branches', 'exists_on_github', true),

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('triggerBuildBranch', this.get('repo.defaultBranch.name'));
  },

  sendTriggerRequest: task(function* () {
    let requestConfig = YAML.parse(this.get('triggerBuildConfig'));
    this.set('isTriggering', true);
    let runInterval = config.intervals.triggerBuildRequestDelay;

    let body = {
      request: {
        branch: this.get('triggerBuildBranch'),
        requestConfig: requestConfig
      }
    };

    if (! Ember.isEmpty(this.get('triggerBuildMessage'))) {
      body.request.message = this.get('triggerBuildMessage');
    }

    try {
      yield this.get('ajax').postV3(`/repo/${this.get('repo.id')}/requests`, body)
        .then((data) => {
          let reqId = data.request.id;

          Ember.run.later(this, function () {
            return this.get('getRequestState').perform(this.get('repo.id'), reqId);
          }, runInterval);
        });
    } catch (e) {
      this.get('flashes').error('Oops, something went wrong, please try again.');
      this.get('onClose')();
    }
  }),

  getRequestState: task(function* (repoId, requestId) {
    try {
      yield this.get('ajax')
        .ajax(`/repo/${repoId}/request/${requestId}`, 'GET',
              { headers: { 'Travis-API-Version': '3' } })
        .then((data) => {
          let reqResult = data.result;
          let triggeredBuild = data.builds ? data.builds[0] : null;

          this.set('isTriggering', false);

          if (reqResult === 'approved' && triggeredBuild) {
            this.get('onClose')();
            return this.get('router').transitionTo('build', this.get('repo'), triggeredBuild.id);
          } else if (reqResult === 'rejected') {
            this.get('flashes').error(`You tried to trigger a build
for ${this.get('repo.slug')} but the request was rejected.`);
            this.get('onClose')();
            return this.get('router').transitionTo('requests', this.get('repo'),
                                                   { queryParams: { requestId: requestId } });
          } else {
            this.get('flashes').notice(`You successfully triggered a build
for ${this.get('repo.slug')}. It might take a moment to show up though.`, 'Hold tight!');
            this.get('onClose')();
            return this.get('router').transitionTo('requests', this.get('repo'),
                                                   { queryParams: { requestId: requestId } });
          }
        });
    } catch (e) {
      this.get('flashes').error('Oops, something went wrong, please try again.');
      this.get('onClose')();
    }
  }),

  actions: {
    toggleTriggerBuildModal() {
      this.get('onClose')();
    }
  }
});
