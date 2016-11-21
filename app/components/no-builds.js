import Ember from 'ember';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  triggerBuild: task(function* () {
    yield Ember.RSVP.resolve(true);
  }).drop()
});
