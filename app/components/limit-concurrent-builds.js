import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  classNames: ['limit-concurrent-builds'],

  description: Ember.computed('enabled', function () {
    let description;
    description = 'Limit concurrent jobs';
    if (this.get('enabled')) {
      description += '  ';
    }
    return description;
  }),

  limitChanged(value) {
    let limit, repo, savingFinished;
    repo = this.get('repo');
    limit = parseInt(value);
    if (limit) {
      this.set('isSaving', true);
      savingFinished = () => {
        this.set('isSaving', false);
      };
      return repo.saveSetting('maximum_number_of_builds', limit)
        .then(savingFinished, savingFinished);
    }
  },

  toggle: task(function* () {
    if (!this.get('enabled') && this.get('value') !== 0) {
      try {
        yield this.get('repo').saveSetting('maximum_number_of_builds', 0);
      } catch (e) {
        // eslint-disable-next-line
        console.log('Exception setting maximum number of builds to 0', e);
      }

      this.set('value', 0);
    }
  }).drop(),

  actions: {
    limitChanged() {
      return Ember.run.debounce(this, 'limitChanged', 1000);
    }
  }
});
