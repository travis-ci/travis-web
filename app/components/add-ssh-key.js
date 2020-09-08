import { observer } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  classNames: ['form--sshkey'],
  classNameBindings: ['valueError:form-error'],
  isSaving: false,

  sshKeyAdded() {},

  didInsertElement() {
    let id = this.get('repo.id');
    let store = this.store;
    const model = store.peekRecord('ssh_key', id)
      || store.createRecord('ssh_key', { id });

    return this.set('model', model);
  },

  isValid() {
    if (isBlank(this.value)) {
      this.set('valueError', 'Value can\'t be blank.');
      return false;
    } else {
      return true;
    }
  },

  reset() {
    return this.setProperties({
      description: null,
      value: null
    });
  },

  valueChanged: observer('value', function () {
    return this.set('valueError', false);
  }),

  addErrorsFromResponse(errArr) {
    if (errArr !== undefined && errArr.length) {
      const { code } = errArr[0];

      if (code === 'not_a_private_key') {
        return this.set('valueError', 'This key is not a private key.');
      } else if (code === 'key_with_a_passphrase') {
        return this.set('valueError', 'The key can\'t have a passphrase.');
      }
    }
  },

  save: task(function* () {
    this.set('valueError', false);

    if (this.isValid()) {
      const sshKey = this.model;
      sshKey.setProperties({
        description: this.description,
        value: this.value
      });

      try {
        yield sshKey.save();
        this.reset();
        return this.sshKeyAdded(sshKey);
      } catch ({ errors }) {
        return this.addErrorsFromResponse(errors);
      }
    }
  }).drop()
});
