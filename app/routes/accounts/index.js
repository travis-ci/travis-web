import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

const { service } = Ember.inject;

export default TravisRoute.extend({
  auth: service(),

  redirect: function () {
    // TODO: setting accounts model in ProfileRoute is wrong, but
    //       at this stage it's better than what we had before
    var account, accounts, login;
    accounts = this.modelFor('accounts');
    login = this.get('auth.currentUser.login');
    account = accounts.find(function (account) {
      return account.get('login') === login;
    });
    return this.transitionTo('account', account);
  }
});
