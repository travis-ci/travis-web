import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  @service store: null,

  classNames: ['form--sshkey'],
  classNameBindings: ['valueError:form-error'],
  isSaving: false,

  didInsertElement() {
    let id = this.get('repo.id');
    let store = this.get('store');
    const model = store.peekRecord('ssh_key', id)
      || store.createRecord('ssh_key', { id });

    return this.set('model', model);
  },

  isValid() {
    if (Ember.isBlank(this.get('value'))) {
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

  valueChanged: Ember.observer('value', function () {
    return this.set('valueError', false);
  }),

  addErrorsFromResponse(errArr) {
    if (errArr !== undefined && errArr.length) {
      let error = errArr[0].detail;

      if (error.code === 'not_a_private_key') {
        return this.set('valueError', 'This key is not a private key.');
      } else if (error.code === 'key_with_a_passphrase') {
        return this.set('valueError', 'The key can\'t have a passphrase.');
      }
    }
  },

  save: task(function* () {
    this.set('valueError', false);

    if (this.isValid()) {
      const sshKey = this.get('model');
      sshKey.setProperties({
        description: this.get('description'),
        value: this.get('value')
      });

      try {
        yield sshKey.save();
        this.reset();
        return this.sendAction('sshKeyAdded', sshKey);
      } catch ({ errors }) {
        return this.addErrorsFromResponse(errors);
      }
    }
  }).drop()
});
