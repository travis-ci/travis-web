import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,

  redirect: function () {
    // TODO: setting accounts model in ProfileRoute is wrong, but
    //       at this stage it's better than what we had before
    let account, accounts, login;
    accounts = this.modelFor('accounts');
    login = this.get('auth.currentUser.login');
    account = accounts.find(acct => acct.get('login') === login);
    return this.transitionTo('account', account);
  }
});
