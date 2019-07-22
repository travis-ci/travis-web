import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  tagName: 'li',
  classNames: ['settings-cron'],
  actionType: 'Save',

  dontRunIfRecentBuildExists: computed('cron.dont_run_if_recent_build_exists', function () {
    let dontRun = this.get('cron.dont_run_if_recent_build_exists');
    if (dontRun) {
      return 'Do not run if there has been a build in the last 24h';
    }
    return 'Always run';
  }),

  delete: task(function* () {
    yield this.cron.destroyRecord();
  }).drop()
});
