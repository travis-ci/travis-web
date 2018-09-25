import { isBlank, isEqual } from '@ember/utils';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { controller } from 'ember-decorators/controller';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';

export default Controller.extend({
  page: 1,

  @service flashes: null,
  @service api: null,

  @controller('dashboard') dashboardController: null,

  @computed('model.starredRepos.[]',
    'model.starredRepos.@each.currentBuildState',
    'model.starredRepos.@each.currentBuildFinishedAt')
  starredRepos(repositories) {
    return repositories.toArray().sort(dashboardRepositoriesSort);
  },

  @computed('model.repos.[]',
    'account',
    'model.accounts',
    'model.repos.@each.currentBuildState',
    'model.repos.@each.currentBuildFinishedAt'
  )
  filteredRepos(repositories, accountParam, accounts) {
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
      if (!isBlank(account)) {
        if (isEqual(type, 'user')) {
          if (isEqual(item.get('owner.@type'), 'user')) {
            return item;
          }
        } else {
          if (isEqual(item.get('owner.login'), accountParam)) {
            return item;
          }
        }
      } else {
        return item;
      }
    }).sort(dashboardRepositoriesSort);
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
      let login = isBlank(org) ? undefined : org.get('login');
      return this.set('account', login);
    }
  }
});
