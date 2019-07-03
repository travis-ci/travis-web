import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { bindKeyboardShortcuts, unbindKeyboardShortcuts } from 'ember-keyboard-shortcuts';

export default Component.extend({
  classNames: ['remove-log-popup'],

  flashes: service(),

  keyboardShortcuts: {
    'esc': 'toggleRemoveLogModal'
  },

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  actions: {

    removeLog() {
      let job = this.get('job');

      this.get('onCloseModal')();

      return job.removeLog().then(() => {
        this.get('flashes').success('Log has been successfully removed.');
      }, (xhr) => {
        if (xhr.status === 409) {
          return this.get('flashes').error('Log can’t be removed');
        } else if (xhr.status === 401) {
          return this.get('flashes').error('You don’t have sufficient access to remove the log');
        } else {
          return this.get('flashes').error('An error occurred when removing the log');
        }
      });
    },

    toggleRemoveLogModal() {
      this.get('onCloseModal')();
    }

  }

});
