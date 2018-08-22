import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  @service features: null,
  @service featureFlags: null,

  buildEmails: false,

  toggleBuildEmails: task(function* (value) {
    yield this.set('buildEmails', value);
  }).restartable()
});
