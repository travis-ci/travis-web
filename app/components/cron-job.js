import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  @service store: null,

  tagName: 'li',
  classNames: ['settings-cron'],
  actionType: 'Save',
  dontRunIfRecentBuildExists: Ember.computed('cron.dont_run_if_recent_build_exists', function () {
    if (this.get('cron.dont_run_if_recent_build_exists')) {
      return 'Do not run if there has been a build in the last 24h';
    } else {
      return 'Always run';
    }
  }),

  delete: task(function* () {
    yield this.get('cron').destroyRecord();
  }).drop()
});
