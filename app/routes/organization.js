import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  accounts: service(),
  features: service(),
  auth: service(),
  needsAuth: true,

  titleToken(org = {}) {
    return `${org.error ? 'Account' : org.name || org.login} - Profile`;
  },

  beforeModel() {
    if (this.auth.signedIn) {
      const { fetchOrganizations } = this.accounts;
      const { lastSuccessful } = fetchOrganizations;
      if (lastSuccessful && lastSuccessful._promise) {
        return lastSuccessful._promise;
      } else {
        return fetchOrganizations.perform();
      }
    } else {
      return this._super(...arguments);
    }
  },

  model({ login }) {
    const org = this.accounts.organizations.findBy('login', login);
    return org || { login, error: true };
  },

  afterModel(model) {
    if (model && !model.error && !this.features.get('enterpriseVersion'))
      model.fetchBetaMigrationRequests();
  }
});
