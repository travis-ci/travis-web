import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

const SECTION_ROUTE_MAP = {
  preferences: 'settings',
  subscription: 'billing'
};

export default TravisRoute.extend({
  @service accounts: null,

  beforeModel({ params, targetName }) {
    const { section, login } = params[targetName] || {};
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
