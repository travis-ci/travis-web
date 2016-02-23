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
      var cron, self, store, repo_id, branch;

      if (this.get('isSaving')) {
        return;
      }

      self = this;
      store = this.get('store');
      repo_id = this.get('repo.id');
      branch = this.get('selectedBranch') ? this.get('selectedBranch') : this.get('repo.branches').toArray()[0];

      store.filter('cron', {
        repository_id: repo_id
      }, function(c) {
        return c.get('branch.repoId') === repo_id && c.get('branch.name') == branch.get('name');
      }).then(function(existing_crons){
        if(existing_crons.toArray()[0]){
          store.unloadRecord(existing_crons.toArray()[0]);
        }

        self.set('isSaving', true);
        cron = store.createRecord('cron', {
          branch: branch,
          interval: self.get('selectedInterval') || 'monthly',
          disable_by_build: self.get('disable') || false
        });
        return cron.save().then(() => {
          self.set('isSaving', false);
          return self.reset();
        }, () => {
          self.set('isSaving', false);
          return self.reset();
        });
      });
    }
  },

  intervals: function() {
    return ['monthly', 'weekly', 'daily'];
  }.property()

});
