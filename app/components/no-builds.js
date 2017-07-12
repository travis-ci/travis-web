import Ember from 'ember';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  isPR: Ember.computed('tab', function () {
    return this.get('tab') === 'pull_requests';
  }),

  isBranch: Ember.computed('tab', function () {
    return this.get('tab') === 'branches';
  }),

  triggerBuild: task(function* () {
    const apiEndpoint = config.apiEndpoint;

    yield Ember.$.ajax(`${apiEndpoint}/repo/${this.get('repo.repo.id')}/requests`, {
      headers: {
        Authorization: `token ${this.get('repo.auth')}`,
        'Travis-API-Version': '3'
      },
      type: 'POST'
    });
  }).drop()
});
