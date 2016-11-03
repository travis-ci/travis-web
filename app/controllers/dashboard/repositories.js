import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Controller.extend({
  queryParams: ['account'],
  flashes: service(),
  ajax: service(),

  filteredRepos: Ember.computed('model.repos', 'account', function () {
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

  activeRepos: Ember.computed('filteredRepos', function () {
    return this.get('filteredRepos').filter(function (item) {
      if (!item.get('starred')) {
        return item;
      }
    });
  }),

  starredRepos: Ember.computed('filteredRepos', function () {
    return this.get('filteredRepos').filter(function (item) {
      if (item.get('starred')) {
        return item;
      }
    });
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
    },
    star(repo) {
      this.get('ajax').ajax(`/v3/repo/${repo.get('id')}/star`, 'POST')
        .then(() => {
          this.get('flashes')
            .success(`You successfully starred ${repo.get('slug')}`);
        });
    },
    unstar(repo) {
      this.get('ajax').ajax(`/v3/repo/${repo.get('id')}/unstar`, 'POST')
        .then(() => {
          this.get('flashes')
            .success(`You successfully unstarred ${repo.get('slug')}`);
        });
    }
  }
});
