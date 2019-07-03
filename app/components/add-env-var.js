import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  classNames: ['form--envvar'],

  store: service(),
  raven: service(),
  flashes: service(),

  reset() {
    return this.setProperties({
      name: null,
      value: null,
      'public': null,
      branch: null
    });
  },

  search: task(function* (query) {
    const searchResults = yield this.searchBranch.perform(this.repo.id, query);
    return searchResults.mapBy('name');
  }),

  save: task(function* () {
    const envVar = this.get('store').createRecord('env_var', {
      name: this.name.trim(),
      value: this.value.trim(),
      'public': this.public,
      repo: this.repo,
      branch: this.branch ? this.branch.name : null
    });

    try {
      yield envVar.save().then(saved => saved.set('newlyCreated', true));
      this.reset();
    } catch (e) {
      // eslint-disable-next-line
      this.get('flashes').error('There was an error saving this environment variable.');
      this.get('raven').logException(e);
    }
  }).drop(),

  actions: {
    validateEnvName() {
      const { branch } = this;
      const envAlreadyDefined = !!this.store.peekAll('env_var').filter(env =>
        env.get('name') == this.name.trim() && env.get('branch') == branch
      ).length;
      if (envAlreadyDefined) {
        return `Environment variable ${this.get('name')} for ${branch || 'all'} branch${branch ? '' : 'es'} is already defined.`;
      }
      return true;
    }
  }
});
