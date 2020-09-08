import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { gt, reads } from '@ember/object/computed';

export default Controller.extend({
  auth: service(),
  multiVcs: service(),

  accounts: reads('auth.accounts'),
  hasAccounts: gt('accounts.length', 0),

  actions: {
    signIn(provider) {
      this.auth.signInWith(provider);
    },
  },
});
