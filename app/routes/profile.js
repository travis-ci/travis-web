import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

const SECTION_ROUTE_MAP = {
  preferences: 'settings',
  plan: 'billing'
};

export default TravisRoute.extend({
  accounts: service(),

  beforeModel({ targetName }) {
    const { section, login } = this.paramsFor('profile') || {};
    const isUserAccount = this.accounts.user.login === login;
    const root = isUserAccount ? 'account' : 'organization';

    const routeName = `${root}${section ? `.${SECTION_ROUTE_MAP[section] || section}` : ''}`;

    if (isUserAccount) {
      this.transitionTo(routeName);
    } else {
      this.transitionTo(routeName, login);
    }
  }
});
