import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['account'],

  filteredRepos: Ember.computed('model.repos', 'account', function () {
    let login = this.get('account');
    let accountType = this.get('account.type');
    let repos = this.get('model.repos');

    repos = repos.filter(function (item) {
      if (!Ember.isBlank(login)) {
        if (Ember.isEqual(accountType, 'user')) {
          // everything that does not belong to an org ??
        } else {
          if (Ember.isEqual(item.get('owner'), login)) {
            return item;
          }
        }
      } else {
        return item;
      }
    }).sort(function (a, b) {
      // check 3 different things
      // - has a currentBuild at all
      if (Ember.isBlank(a.get('currentBuild.state'))) {
        return 1;
      }
      if (Ember.isBlank(b.get('currentBuild.state'))) {
        return -1;
      }
      // - what is the currentBuild.finishedAt
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

      // - has a build on default branch?
      if (Ember.isBlank(a.get('defaultBranch.lastBuild.state'))) {
        return 1;
      }
      if (Ember.isBlank(b.get('defaultBranch.lastBuild.state'))) {
        return -1;
      }
      
    });
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
