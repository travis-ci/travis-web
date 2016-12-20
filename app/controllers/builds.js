import Ember from 'ember';

const { controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  buildsSorting: ['number:desc'],
  builds: Ember.computed.sort('model', 'buildsSorting'),
  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  tab: alias('repoController.tab'),
  isLoaded: alias('model.isLoaded'),
  isLoading: alias('model.isLoading'),

  showMore() {
    var id, number, type;
    id = this.get('repo.id');
    number = this.get('builds.lastObject.number');
    const tabName = this.get('tab');
    const singularTab = tabName.substr(0, tabName.length - 1);
    type = this.get('tab') === 'builds' ? 'push' : singularTab;
    this.olderThanNumber(id, number, type);
  },

  displayShowMoreButton: Ember.computed('tab', 'builds.lastObject.number', function () {
    return this.get('tab') !== 'branches' && parseInt(this.get('builds.lastObject.number')) > 1;
  }),

  displayPullRequests: Ember.computed('tab', function () {
    return this.get('tab') === 'pull_requests';
  }),

  displayBranches: Ember.computed('tab', function () {
    return this.get('tab') === 'branches';
  }),

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
