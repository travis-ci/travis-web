import Ember from 'ember';

export default Ember.Controller.extend({
  sortAscending: false,
  sortProperties: ['number'],
  repoController: Ember.inject.controller('repo'),
  repoBinding: 'repoController.repo',
  tabBinding: 'repoController.tab',
  isLoadedBinding: 'model.isLoaded',
  isLoadingBinding: 'model.isLoading',

  showMore() {
    var id, number, type;
    id = this.get('repo.id');
    number = this.get('model.lastObject.number');
    type = this.get('tab') === "model" ? 'push' : 'pull_request';
    return this.get('model').load(this.olderThanNumber(id, number, type));
  },

  displayShowMoreButton: function() {
    return this.get('tab') !== 'branches' && parseInt(this.get('model.lastObject.number')) > 1;
  }.property('tab', 'model.lastObject.number'),

  displayPullRequests: function() {
    return this.get('tab') === 'pull_requests';
  }.property('tab'),

  displayBranches: function() {
    return this.get('tab') === 'branches';
  }.property('tab'),

  noticeData: function() {
    return {
      repo: this.get('repo'),
      auth: this.auth.token()
    };
  }.property('repo'),

  olderThanNumber(id, number, type) {
    var options;
    options = {
      repository_id: id,
      after_number: number
    };
    if (type != null) {
      options.event_type = type.replace(/s$/, '');
      if (options.event_type === 'push') {
        options.event_type = ['push', 'api'];
      }
    }
    return this.store.query('build', options);
  },

  actions: {
    showMoreBuilds() {
      return this.showMore();
    }
  }
});
