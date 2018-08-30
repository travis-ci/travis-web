import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';
import { and } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service features: null,
  @service featureFlags: null,

  buildEmails: false,
  unsubscribedRepos: null,

  @and('buildEmails', 'unsubscribedRepos.length')
  showResubscribeList: false,

  toggleBuildEmails: task(function* (value) {
    // TODO implement API integration
    yield this.set('buildEmails', value);
  }).restartable()
});
