import Ember from 'ember';
import { task, taskGroup } from 'ember-concurrency';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Controller.extend({
  queryParams: ['account', 'offset'],
  offset: 0,

  @service flashes: null,
  @service ajax: null,

  starring: taskGroup().drop(),

  @computed()
  tasks() {
    return [
      this.get('star'),
      this.get('unstar')
    ];
  },

  star: task(function* (repo) {
    repo.set('starred', true);
    try {
      yield this.get('ajax').postV3(`/repo/${repo.get('id')}/star`);
    } catch (e) {
      repo.set('starred', false);
      this.get('flashes')
        .error(`Something went wrong while trying to star  ${repo.get('slug')}.
               Please try again.`);
    }
  }).group('starring'),

  unstar: task(function* (repo) {
    repo.set('starred', false);
    try {
      yield this.get('ajax').postV3(`/repo/${repo.get('id')}/unstar`);
    } catch (e) {
      repo.set('starred', true);
      this.get('flashes')
        .error(`Something went wrong while trying to unstar  ${repo.get('slug')}.
               Please try again.`);
    }
  }).group('starring'),

  @alias('model.repos.@each.currentBuild') repositoriesCurrentBuilds: null,

  @computed('model.repos.[]',
            'repositoriesCurrentBuilds.@each.finishedAt',
            'account',
            'model.accounts')
  filteredRepos(repositories, currentBuilds, accountParam, accounts) {
    let account = accounts.filter((x) => {
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

    const repos = repositories.filter((item) => {
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
    }).sort((a, b) => {
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
  },

  @computed('model.accounts', 'account')
  selectedOrg(accounts, account) {
    let filteredAccount = accounts.filter((item) => {
      if (item.get('login') === account) {
        return item;
      }
    });
    return filteredAccount[0];
  },

  actions: {
    selectOrg(org) {
      let login = Ember.isBlank(org) ? undefined : org.get('login');
      return this.set('account', login);
    }
  }
});
