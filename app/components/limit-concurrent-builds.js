import { debounce } from '@ember/runloop';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['limit-concurrent-builds'],

  description: computed('enabled', function () {
    let enabled = this.enabled;
    let description = 'Limit concurrent jobs';
    if (enabled) {
      description += '  ';
    }
    return description;
  }),

  limitChanged(value) {
    let limit, repo, savingFinished;
    repo = this.repo;
    limit = parseInt(value);
    if (limit) {
      this.set('isSaving', true);
      savingFinished = () => {
        this.set('isSaving', false);
      };
      this.set('value', value);
      return repo.saveSetting('maximum_number_of_builds', limit)
        .then(savingFinished, savingFinished);
    }
  },

  toggle: task(function* (value) {
    this.set('enabled', value);
    if (!this.enabled && this.value !== 0) {
      try {
        yield this.repo.saveSetting('maximum_number_of_builds', 0);
      } catch (e) {
        // eslint-disable-next-line
        this.flashes.error('There was an error disabling the concurrent jobs limit.');
        this.raven.logException(e);
      }

      this.set('value', 0);
    }
  }).drop(),

  actions: {
    limitChanged() {
      return debounce(this, 'limitChanged', 1000);
    }
  }
});
