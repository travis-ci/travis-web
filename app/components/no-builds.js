import Ember from 'ember';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  triggerBuild: task(function* () {
    const apiEndpoint = config.apiEndpoint;

    yield Ember.$.ajax(`${apiEndpoint}/v3/repo/${this.get('repo.repo.id')}/requests`, {
      headers: {
        Authorization: `token ${this.get('repo.auth')}`
      },
      type: 'POST'
    });
  }).drop()
});
