import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service featureFlags: null,
  @alias('featureFlags.fetchTask.isRunning') featuresLoading: null,
});
