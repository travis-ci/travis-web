import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Controller.extend({
  queryParams: ['org'],
  filter: null,
  org: null,

  filteredRepositories: function() {
    var filter, org, repos;
    filter = this.get('filter');
    repos = this.get('model');
    org = this.get('org');
    repos = repos.filter(function(item, index) {
      if (item.get('default_branch')) {
        return item.get('default_branch.last_build') !== null;
      }
    }).sortBy('default_branch.last_build.finished_at').reverse();
    if (org) {
      repos = repos.filter(function(item, index) {
        return item.get('owner.login') === org;
      });
    }
    if (Ember.isBlank(filter)) {
      return repos;
    } else {
      return repos.filter(function(item, index) {
        return item.slug.match(new RegExp(filter));
      });
    }
  }.property('filter', 'model', 'org'),

  updateFilter() {
    var value;
    value = this.get('_lastFilterValue');
    this.transitionToRoute({
      queryParams: {
        filter: value
      }
    });
    return this.set('filter', value);
  },

  selectedOrg: function() {
    return this.get('orgs').findBy('login', this.get('org'));
  }.property('org', 'orgs.[]'),

  orgs: function() {
    var apiEndpoint, orgs;
    orgs = Ember.ArrayProxy.create({
      content: [],
      isLoading: true
    });
    apiEndpoint = config.apiEndpoint;
    $.ajax(apiEndpoint + '/v3/orgs', {
      headers: {
        Authorization: 'token ' + this.auth.token()
      }
    }).then(function(response) {
      var array;
      array = response.organizations.map(function(org) {
        return Ember.Object.create(org);
      });
      orgs.set('content', array);
      return orgs.set('isLoading', false);
    });
    return orgs;
  }.property(),

  actions: {
    updateFilter(value) {
      this.set('_lastFilterValue', value);
      return Ember.run.throttle(this, this.updateFilter, [], 200, false);
    },

    selectOrg(org) {
      var login;
      login = org ? org.get('login') : null;
      return this.set('org', login);
    }
  }
});
