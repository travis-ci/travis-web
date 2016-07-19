import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  redirect() {
    // TODO: setting accounts model in ProfileRoute is wrong, but
    //       at this stage it's better than what we had before
    let account, accounts, login;
    accounts = this.modelFor('accounts');
    login = this.controllerFor('currentUser').get('model.login');
    account = accounts.find(account => account.get('login') === login);
    return this.transitionTo('account', account);
  }
});
