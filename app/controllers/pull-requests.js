import Ember from 'ember';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

const mixins = [LoadMoreBuildsMixin];

export default Ember.Controller.extend(...mixins, {
  tabStates: service(),

  buildsSorting: ['number:desc'],
  builds: Ember.computed.sort('model', 'buildsSorting'),
  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  tab: alias('tabStates.mainTab'),
  isLoaded: alias('model.isLoaded'),
  isLoading: alias('model.isLoading'),

  displayShowMoreButton: Ember.computed('tab', 'builds.lastObject.number', function () {
    return this.get('tab') !== 'branches' && parseInt(this.get('builds.lastObject.number')) > 1;
  }),
});
