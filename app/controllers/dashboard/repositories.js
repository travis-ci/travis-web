import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Controller.extend({
  queryParams: ['account'],
  /*
  filteredRepositories: Ember.computed('filter', 'model', 'org', function () {
    var filter, org, repos;
    filter = this.get('filter');
    repos = this.get('model');
    org = this.get('org');
    repos = repos.filter(function (item) {
      return item.get('currentBuild') !== null;
    }).sort(function (a, b) {
      if (a.currentBuild.finished_at === null) {
        return -1;
      }
      if (b.currentBuild.finished_at === null) {
        return 1;
      }
      if (a.currentBuild.finished_at < b.currentBuild.finished_at) {
        return 1;
      }
      if (a.currentBuild.finished_at > b.currentBuild.finished_at) {
        return -1;
      }
      if (a.currentBuild.finished_at === b.currentBuild.finished_at) {
        return 0;
      }
    });

    if (org) {
      repos = repos.filter(function (item) {
        return item.get('owner.login') === org;
      });
    }
    if (Ember.isBlank(filter)) {
      return repos;
    } else {
      return repos.filter(function(item) {
        return item.slug.match(new RegExp(filter));
      });
    }
  }),
*/

  selectedOrg: Ember.computed('account', function () {
    let accounts = this.get('model.accounts');
    let filter =  this.get('account');

    let filteredAccount = accounts.filter(function(item) {
      if (item.get('login') === filter) {
        return item;
      }
    });
    return filteredAccount[0];
  }),

  actions: {
    selectOrg(org) {
      let login = org ? org.get('login') : null;
      return this.set('account', login);
    }
  }
});
