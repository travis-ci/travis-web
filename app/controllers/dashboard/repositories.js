import { isBlank, isEqual } from '@ember/utils';
import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';

export default Controller.extend({
  page: 1,

  flashes: service(),
  api: service(),

  dashboardController: controller('dashboard'),

  starredRepos: computed(
    'model.starredRepos.[]',
    'model.starredRepos.@each.currentBuildState',
    'model.starredRepos.@each.currentBuildFinishedAt',
    function () {
      let repositories = this.get('model.starredRepos');
      return repositories.toArray().sort(dashboardRepositoriesSort);
    }
  ),

  filteredRepos: computed(
    'model.repos.[]',
    'account',
    'model.accounts',
    'model.repos.@each.currentBuildState',
    'model.repos.@each.currentBuildFinishedAt',
    function () {
      let repositories = this.get('model.repos');
      let accountParam = this.account;
      let accounts = this.get('model.accounts');
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
    }
  ),

  selectedOrg: computed('model.accounts', 'account', function () {
    let accounts = this.get('model.accounts');
    let account = this.account;
    let filteredAccount = accounts.filter((item) => {
      if (item.get('login') === account) {
        return item;
      }
    });
    return filteredAccount[0];
  }),

  actions: {
    selectOrg(org) {
      let login = isBlank(org) ? undefined : org.get('login');
      return this.set('account', login);
    }
  }
});
