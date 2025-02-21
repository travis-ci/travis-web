import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import BranchSearching from 'travis/mixins/branch-searching';

export default Component.extend(BranchSearching, {
  classNames: ['form--envvar'],
  classNameBindings: ['valueError:form-error'],

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
      'public': null
    });
  },

  save: task(function* () {
    this.set('valueError', false);

    try {
      yield this.api.post(
        '/account_env_vars',
        {
          data: {
            owner_id: this.owner.id,
            owner_type: this.ownerType,
            name: this.name.trim(),
            value: this.value.trim(),
            'public': !!this.public
          }
        }
      ).then((data) => {
        this.envVarAdded(data);
        this.reset();
      });
    } catch (errors) {
      errors.clone().json().then((error) => {
        this.set('valueError', error.error_message);
      });
    }
  }).drop()
});
