import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Controller.extend({
  queryParams: ['account'],
  flashes: service(),
  ajax: service(),

  filteredRepos: Ember.computed('model.repos', 'model.repos.@each.currentBuild.finishedAt', 'account', function () {
    let accounts = this.get('model.accounts');
    let accountParam = this.get('account');
    let account = accounts.filter(function (x) {
      if (accountParam) {
        if (x.id === accountParam) {
          return x;
        }
      } else {
        return null;
      }
    });
    let type = null;
    if (account && account[0]) {
      type = account[0].get('type');
    }
    let repos = this.get('model.repos');

    repos = repos.filter(function (item) {
      if (!Ember.isBlank(account)) {
        if (Ember.isEqual(type, 'user')) {
          if (Ember.isEqual(item.get('owner.@type'), 'user')) {
            return item;
          }
        } else {
          if (Ember.isEqual(item.get('owner.login'), accountParam)) {
            return item;
          }
        }
      } else {
        return item;
      }
    }).sort(function (a, b) {
      if (Ember.isBlank(a.get('currentBuild.state'))) {
        return 1;
      }
      if (Ember.isBlank(b.get('currentBuild.state'))) {
        return -1;
      }
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
      if (Ember.isBlank(a.get('defaultBranch.lastBuild.state'))) {
        return 1;
      }
      if (Ember.isBlank(b.get('defaultBranch.lastBuild.state'))) {
        return -1;
      }
    });
    return repos;
  }),

  starredRepos: Ember.computed.filterBy('filteredRepos', 'starred'),

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
    },
    star(repo) {
      repo.set('starred', true);
      this.get('ajax').ajax(`/v3/repo/${repo.get('id')}/star`, 'POST')
        .catch(() => {
          repo.set('starred', false);
          this.get('flashes')
            .error(`Something went wrong while trying to star  ${repo.get('slug')}. Please try again.`);
        });
    },
    unstar(repo) {
      repo.set('starred', false);
      this.get('ajax').ajax(`/v3/repo/${repo.get('id')}/unstar`, 'POST')
        .catch(() => {
          repo.set('starred', true);
          this.get('flashes')
            .error(`Something went wrong while trying to unstar  ${repo.get('slug')}. Please try again.`);          
        });
    }
  }
});
