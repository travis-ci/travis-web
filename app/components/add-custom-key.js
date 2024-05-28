import { observer } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { reads } from '@ember/object/computed';

export default Component.extend({
  auth: service(),
  api: service(),

  classNames: ['form--sshkey'],
  classNameBindings: ['valueError:form-error'],
  isSaving: false,
  publicKey: null,

  currentUserId: reads('auth.currentUser.id'),

  customKeyAdded(key) {},

  isValid() {
    if (isBlank(this.value)) {
      this.set('valueError', 'Value can\'t be blank.');
      return false;
    } else if (!/^[a-zA-Z_]+$/.test(this.name)) {
      this.set('valueError', 'Only basic letters and underscore allowed in Identifier.');
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

  save: task(function* () {
    this.set('valueError', false);

    if (this.isValid()) {
      try {
        yield this.api.post(
          '/custom_keys',
          {
            data: {
              owner_id: this.owner.id,
              owner_type: this.ownerType,
              name: this.name,
              private_key: this.value,
              description: this.description,
              added_by: this.currentUserId,
              public_key: this.publicKey
            }
          }
        ).then((data) => {
          this.customKeyAdded(data);
          this.set('value', '');
          this.set('name', '');
          this.set('description', '');
          this.set('publicKey',null);
        });
      } catch (errors) {
        errors.clone().json().then((error) => {
          this.set('valueError', error.error_message);
        });
      }
    }
  }).drop()
});
