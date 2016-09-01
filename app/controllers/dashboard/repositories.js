import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['account'],

  filteredRepos: Ember.computed('model', 'account', function () {
    let login = this.get('account');
    let repos = this.get('model.repos');

    if (!Ember.isBlank(login)) {
      repos = repos.filter(function (item) {
        if (Ember.isEqual(item.get('owner'), login)) {
          return item;
        }
      }).sort(function (a, b) {
        if (Ember.isBlank(a.get('currentBuild.finishedAt'))) {
          return -1;
        }
        if (Ember.isBlank(b.get('currentBuild.finishedAt'))) {
          return 1;
        }
        if (a.get('currentBuild.finishedAt') < b.get('currentBuild.finishedAt')) {
          return 1;
        }
        if (a.get('currentBuild.finishedAt') > b.get('currentBuild.finishedAt')) {
          return -1;
        }
        if (a.get('currentBuild.finishedAt') === b.get('currentBuild.finishedAt')) {
          return 0;
        }
      });
    }
    return repos;
  }),

  selectedOrg: Ember.computed('account', function () {
    let accounts = this.get('model.accounts');
    let filter =  this.get('account');

    let filteredAccount = accounts.filter(function (item) {
      if (item.get('login') === filter) {
        return item;
      }
    });
    return filteredAccount[0];
  }),

  actions: {
    selectOrg(org) {
      let login = Ember.isBlank(org) ? undefined : org.get('login');
      return this.set('account', login);
    }
  }
});
