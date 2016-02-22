import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  classNames: ['form--cron'],
  store: Ember.inject.service(),

  reset() {
    return this.setProperties({
      branch: null,
      interval: null,
      disable_by_build: null
    });
  },

  actions: {
    save() {
      var cron, self;
      if (this.get('isSaving')) {
        return;
      }
      this.set('isSaving', true);
      cron = this.get('store').createRecord('cron', {
        branch: this.get('selectedBranch') ? this.get('selectedBranch') : this.get('repo.branches').toArray()[0],
        interval: this.get('selectedInterval') || 'monthly',
        disable_by_build: this.get('disable') || false
      });
      self = this;
      return cron.save().then(() => {
        this.set('isSaving', false);
        return this.reset();
      }, () => {
         this.set('isSaving', false);
        return this.reset();
      });
    }
  },

  intervals: function() {
    return ['monthly', 'weekly', 'daily'];
  }.property()

});
