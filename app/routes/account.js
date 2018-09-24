import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service raven: null,
  @service accounts: null,

  needsAuth: true,

  titleToken({ account = {} }) {
    return account.name || account.login || 'Account';
  },

  model() {
    return this.accounts.user;
  }
});
