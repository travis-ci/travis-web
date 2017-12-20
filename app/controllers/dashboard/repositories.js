import { isBlank, isEqual } from '@ember/utils';
import Controller from '@ember/controller';
import { task, taskGroup } from 'ember-concurrency';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';

export default Controller.extend({
  queryParams: ['account', 'offset'],
  offset: 0,

  @service flashes: null,
  @service api: null,

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
      yield this.get('api').post(`/repo/${repo.get('id')}/star`);
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
      yield this.get('api').post(`/repo/${repo.get('id')}/unstar`);
    } catch (e) {
      repo.set('starred', true);
      this.get('flashes')
        .error(`Something went wrong while trying to unstar  ${repo.get('slug')}.
               Please try again.`);
    }
  }).group('starring'),

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
