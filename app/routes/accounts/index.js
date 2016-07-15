import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  redirect: function() {
    // TODO: setting accounts model in ProfileRoute is wrong, but
    //       at this stage it's better than what we had before
    var account, accounts, login;
    accounts = this.modelFor('accounts');
    login = this.controllerFor('currentUser').get('model.login');
    account = accounts.find(function(account) {
      return account.get('login') === login;
    });
    return this.transitionTo('account', account);
  }
});
