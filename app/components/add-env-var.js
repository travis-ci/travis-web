import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  classNames: ['form--envvar'],

  store: service(),
  raven: service(),
  flashes: service(),

  init() {
    this.reset();
    this._super(...arguments);
  },

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
    const envVar = this.store.createRecord('env_var', {
      name: this.name.trim(),
      value: this.value.trim(),
      'public': this.public,
      repo: this.repo,
      branch: this.branch
    });

    try {
      yield envVar.save().then(saved => saved.set('newlyCreated', true));
      this.reset();
    } catch (e) {
      // eslint-disable-next-line
      this.flashes.error('There was an error saving this environment variable.');
      this.raven.logException(e);
    }
  }).drop(),

  actions: {
    validateEnvName(name) {
      const { branch, repo } = this;
      const existingEnvVars = this.store.peekAll('env-var')
        .filterBy('repo.id', repo.id)
        .filterBy('name', name)
        .filterBy('branch', branch);
      const envAlreadyDefined = isPresent(existingEnvVars);
      if (envAlreadyDefined) {
        return `Variable with this name ${branch ? 'for selected branch ' : ''}is already defined.`;
      }
      return true;
    }
  }
});
