import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,

  redirect: function () {
    const login = this.get('auth.currentUser.login');
    return this.transitionTo('account', login, { queryParams: { offset: 0 } });
  }
});
