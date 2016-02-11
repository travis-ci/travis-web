import Ember from 'ember';

export default Ember.Component.extend({
  logBinding: 'job.log',

  didReceiveAttrs: function(options) {
    this._super(...arguments);

    let oldJob = options.oldAttrs && options.oldAttrs.job && options.oldAttrs.job.value,
        newJob = options.newAttrs && options.newAttrs.job && options.newAttrs.job.value;

    if(newJob !== oldJob) {
      if(newJob) {
        this.setupLog(newJob);
      }

      if(oldJob) {
        this.teardownLog(oldJob);
      }
    }
  },

  teardownLog(job) {
    job.unsubscribe();
  },

  setupLog(job) {
    job.get('log').fetch();
    job.subscribe();
  }
});
