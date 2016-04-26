import Ember from 'ember';

const { controller } = Ember.inject;

export default Ember.Controller.extend({
  buildsSorting: ['number:desc'],
  builds: Ember.computed.sort('model', 'buildsSorting'),
  repoController: controller('repo'),
  repoBinding: 'repoController.repo',
  tabBinding: 'repoController.tab',
  isLoadedBinding: 'model.isLoaded',
  isLoadingBinding: 'model.isLoading',

  showMore() {
    var id, number, type;
    id = this.get('repo.id');
    number = this.get('builds.lastObject.number');
    const tabName = this.get('tab');
    const singularTab = tabName.substr(0, tabName.length-1);
    type = this.get('tab') === "builds" ? 'push' : singularTab;
    this.olderThanNumber(id, number, type);
  },

  displayShowMoreButton: function() {
    return this.get('tab') !== 'branches' && parseInt(this.get('builds.lastObject.number')) > 1;
  }.property('tab', 'builds.lastObject.number'),

  displayPullRequests: function() {
    return this.get('tab') === 'pull_requests';
  }.property('tab'),

  displayBranches: function() {
    return this.get('tab') === 'branches';
  }.property('tab'),

  displayCrons: function() {
    return this.get('tab') === 'crons';
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
        options.event_type = ['push', 'api', 'cron'];
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
