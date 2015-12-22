import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['limit-concurrent-builds'],

  description: function() {
    var description;
    description = "Limit concurrent jobs";
    if (this.get('enabled')) {
      description += "  ";
    }
    return description;
  }.property('enabled'),

  limitChanged() {
    var limit, repo, savingFinished;
    repo = this.get('repo');
    limit = parseInt(this.get('value'));
    if (limit) {
      this.set('isSaving', true);
      savingFinished = () => {
        return this.set('isSaving', false);
      };
      return repo.saveSettings({
        maximum_number_of_builds: limit
      }).then(savingFinished, savingFinished);
    }
  },

  actions: {
    toggle() {
      var savingFinished;
      if (!this.get('enabled')) {
        if (this.get('value') === 0) {
          return;
        }
        if (this.get('isSaving')) {
          return;
        }
        this.set('isSaving', true);
        savingFinished = () => {
          return this.set('isSaving', false);
        };
        this.get('repo').saveSettings({
          maximum_number_of_builds: 0
        }).then(savingFinished, savingFinished);
        return this.set('value', 0);
      }
    },

    limitChanged() {
      return Ember.run.debounce(this, 'limitChanged', 1000);
    }
  }
});
