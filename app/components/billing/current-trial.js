import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({

  subscription: null,

  currentTrial: reads('subscription.current_trial'),
  creditLimit: reads('currentTrial.credit_usage.addon_quantity'),
  userLimit: reads('currentTrial.user_usage.addon_quantity'),
  buildsAllowed: reads('currentTrial.max_builds'),
  jobsPerBuild: reads('currentTrial.max_jobs_per_build'),
  concurrencyLimit: reads('currentTrial.concurrency_limit'),
  buildsTriggered: computed('currentTrial.builds_triggered', function () {
    return (this.currentTrial && this.currentTrial.builds_triggered) ? this.currentTrial.builds_triggered : 0;
  }),

});
