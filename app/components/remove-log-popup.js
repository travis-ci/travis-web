import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

export default Component.extend(KeyboardShortcuts, {
  @service flashes: null,

  keyboardShortcuts: {
    'esc': 'toggleRemoveLogModal'
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
