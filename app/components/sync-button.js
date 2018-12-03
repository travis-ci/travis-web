import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  auth: service(),

  user: alias('auth.currentUser'),
  classNames: ['sync-button'],

  actions: {
    sync() {
      return this.get('user').sync();
    }
  }
});
