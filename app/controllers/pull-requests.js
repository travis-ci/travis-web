import Ember from 'ember';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';

const { controller } = Ember.inject;
const { alias } = Ember.computed;

const mixins = [LoadMoreBuildsMixin];

export default Ember.Controller.extend(...mixins, {
  buildsSorting: ['number:desc'],
  builds: Ember.computed.sort('model', 'buildsSorting'),
  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  tab: alias('repoController.tab'),
  isLoaded: alias('model.isLoaded'),
  isLoading: alias('model.isLoading'),

  displayPullRequests: Ember.computed('tab', function () {
    return this.get('tab') === 'pull_requests';
  }),

  displayBranches: Ember.computed('tab', function () {
    return this.get('tab') === 'branches';
  }),
});
