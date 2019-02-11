import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service(),

  afterModel() {
    const { currentUser } = this.auth;
    return this.auth.refreshUserData(currentUser, ['user.emails']);
  }
});
