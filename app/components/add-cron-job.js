import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['form--cron'],
  store: service(),

  reset() {
    this.setProperties({
      selectedBranch: null,
      selectedInterval: null,
      disable: null
    });
  },

  actions: {
    save() {
      var cron, self, store, repo_id, branch;

      if (this.get('isSaving')) {
        return;
      }

      store = this.get('store');
      repo_id = this.get('branches').toArray()[0].get('repoId');
      branch = this.get('selectedBranch') ? this.get('selectedBranch') : this.get('branches').toArray()[0];

      store.filter('cron', {
        repository_id: repo_id
      }, function(c) {
        return c.get('branch.repoId') === repo_id && c.get('branch.name') === branch.get('name');
      }).then((existing_crons) => {
        if(existing_crons.toArray()[0]){
          store.unloadRecord(existing_crons.toArray()[0]);
        }

        this.set('isSaving', true);
        cron = store.createRecord('cron', {
          branch: branch,
          interval: this.get('selectedInterval') || 'monthly',
          disable_by_build: this.get('disable') || false
        });
        this.reset();
        return cron.save().then(() => {
          this.set('isSaving', false);
        }, () => {
          this.set('isSaving', false);
        });
      });
    }
  },

  intervals: ['monthly', 'weekly', 'daily']

});
