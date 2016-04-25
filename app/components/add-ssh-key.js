import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['form--sshkey'],
  classNameBindings: ['valueError:form-error'],
  store: service(),
  isSaving: false,

  didInsertElement() {
    var id = this.get('repo.id');
    var model = this.get('store').recordForId('ssh_key', id);

    if (model) {
      this.get('store').unloadRecord(model);
      var typeMap = this.get('store').typeMapFor(model.constructor);
      var idToRecord = typeMap.idToRecord;
      delete idToRecord[id];
    }

    model = this.get('store').createRecord('ssh_key', { id: id });

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

  valueChanged: function() {
    return this.set('valueError', false);
  }.observes('value'),

  addErrorsFromResponse(errArr) {
    var error = errArr[0].detail;

    if (error.code === 'not_a_private_key') {
      return this.set('valueError', 'This key is not a private key.');
    } else if (error.code === 'key_with_a_passphrase') {
      return this.set('valueError', 'The key can\'t have a passphrase.');
    }
  },

  actions: {
    save() {
      var ssh_key;

      this.set('valueError', false);
      if (this.get('isSaving')) {
        return;
      }
      this.set('isSaving', true);
      if (this.isValid()) {
        ssh_key = this.get('model');
        ssh_key.setProperties({
          description: this.get('description'),
          value: this.get('value')
        });
        return ssh_key.save().then(() => {
          this.set('isSaving', false);
          this.reset();
          return this.sendAction('sshKeyAdded', ssh_key);
        }, (error) => {
          this.set('isSaving', false);
          if (error.errors) {
            return this.addErrorsFromResponse(error.errors);
          }
        });
      } else {
        return this.set('isSaving', false);
      }
    }
  }
});
