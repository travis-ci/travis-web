import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  classNames: ['form--envvar'],

  api: service(),
  store: service(),
  raven: service(),
  flashes: service(),

  init() {
    this.reset();
    this._super(...arguments);
  },

  envVarAdded(envVar) {},

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
    // this.set('valueError', false);

    console.log("saving env var");
    if (true) {
      try {
        yield this.api.post(
          '/account_env_var',
          {
            data: {
              owner_id: this.owner.id,
              owner_type: this.ownerType,
              name: this.name.trim(),
              value: this.value.trim(),
              'public': this.public
            }
          }
        ).then((data) => {
          this.envVarAdded(data);
          this.set('value', '');
          this.set('name', '');
        });
      } catch (errors) {
        errors.clone().json().then((error) => {
          this.set('valueError', error.error_message);
        });
      }
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
