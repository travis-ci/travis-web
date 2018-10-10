import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service accounts: null,

  needsAuth: true,

  titleToken(org = {}) {
    return `${org.error ? 'Account' : org.name || org.login} - Profile`;
  },

  beforeModel() {
    const { fetchOrganizations } = this.accounts;
    const { lastSuccessful } = fetchOrganizations;
    if (lastSuccessful && lastSuccessful._promise) {
      return lastSuccessful._promise;
    } else {
      return fetchOrganizations.perform();
    }
  },

  model({ login }) {
    const org = this.accounts.organizations.findBy('login', login);
    return org || { login, error: true };
  }
});
