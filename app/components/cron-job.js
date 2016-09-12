import Ember from 'ember';

const { service } = Ember.inject;
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['settings-cron'],
  isDeleting: false,
  actionType: 'Save',
  store: service(),
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
