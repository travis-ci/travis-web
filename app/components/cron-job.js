import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  @service store: null,

  tagName: 'li',
  classNames: ['settings-cron'],
  actionType: 'Save',

  @computed('cron.dont_run_if_recent_build_exists')
  dontRunIfRecentBuildExists(dontRun) {
    if (dontRun) {
      return 'Do not run if there has been a build in the last 24h';
    }
    return 'Always run';
  },

  delete: task(function* () {
    yield this.get('cron').destroyRecord();
  }).drop()
});
