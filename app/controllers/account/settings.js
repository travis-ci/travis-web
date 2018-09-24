import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import { service } from 'ember-decorators/service';

export default Controller.extend({
  @service features: null,

  featureFlags: reads('model.featureFlags'),
  account: reads('model.account')
});
