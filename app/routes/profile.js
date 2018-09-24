import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service accounts: null,

  beforeModel({ params, targetName }) {
    const { section, login } = params[targetName] || {};
    const isUserAccount = this.accounts.user.login === login;

    if (isUserAccount) {
      this.transitionTo(`account.${section}`);
    } else {
      this.transitionTo(`organization.${section}`, login);
    }
  }
});
