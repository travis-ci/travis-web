import Ember from 'ember';
import { task } from 'ember-concurrency';

const { controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  buildsSorting: ['number:desc'],
  builds: Ember.computed.sort('unorderedBuilds', 'buildsSorting'),
  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  tab: alias('repoController.tab'),

  isLoaded: alias('model.isLoaded'),
  isLoading: alias('model.isLoading'),

  amountFetched: 25,
  pageSize: 25,

  showMore: task(function * () {
    const id = this.get('repo.id');

    const tabName = this.get('tab');
    let eventTypes;
    if (tabName === 'builds') {
      eventTypes = ['push', 'cron'];
    } else {
      eventTypes = ['pull_request'];
    }

    const options = {
      event_type: eventTypes,
      repository_id: id,
      page_size: this.get('pageSize'),
      offset: this.get('amountFetched'),
      sort_by: 'finished_at:desc',
    };

    yield this.store.query('build', options).then(() => {
      // this.get('unorderedBuilds').pushObjects(builds.get('content'));
      this.incrementProperty('amountFetched', this.get('pageSize'));
    });
  }),

  displayShowMoreButton: Ember.computed('tab', 'builds.lastObject.number', function () {
    return this.get('tab') !== 'branches' && parseInt(this.get('builds.lastObject.number')) > 1;
  }),

  displayPullRequests: Ember.computed('tab', function () {
    return this.get('tab') === 'pull_requests';
  }),

  displayBranches: Ember.computed('tab', function () {
    return this.get('tab') === 'branches';
  }),

  actions: {
    showMoreBuilds() {
      return this.get('showMore').perform();
    }
  }
});
