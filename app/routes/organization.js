import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service accounts: null,

  needsAuth: true,

  titleToken(org = {}) {
    return `${org.error ? 'Account' : org.name || org.login} - Profile`;
  },

  beforeModel() {
    return this.accounts.fetchOrganizations.perform();
  },

  model({ login }) {
    const org = this.accounts.organizations.findBy('login', login);
    return org || { login, error: true };
  }
});
