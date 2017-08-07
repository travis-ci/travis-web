import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Controller.extend({
  @service featureFlags: null,
  @alias('featureFlags.fetchTask.isRunning') featuresLoading: null,
});
