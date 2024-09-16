import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { gt } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  auth: service(),
  multiVcs: service(),
  features: service(),

  accounts: computed('auth.accounts.[]', function () {
    const accounts = this.auth.accounts || [];
    return [...new Set(accounts)];
  }),
  hasAccounts: gt('accounts.length', 0),

  actions: {
    signIn(provider) {
      this.auth.signInWith(provider);
    },
  },
});
