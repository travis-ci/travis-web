import { sort, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { computed } from '@ember/object';

const mixins = [LoadMoreBuildsMixin];

export default Controller.extend(...mixins, {
  repoController: controller('repo'),

  buildsSorting: ['number:desc'],
  builds: sort('loadedBuilds', 'buildsSorting'),

  repo: alias('repoController.repo'),
  tab: alias('repoController.tab'),
  isLoaded: alias('model.isLoaded'),
  isLoading: alias('model.isLoading'),

  displayShowMoreButton: computed('tab', 'builds.lastObject.number', function () {
    let tab = this.tab;
    let lastBuildNumber = this.get('builds.lastObject.number');
    return tab !== 'branches' && parseInt(lastBuildNumber) > 1;
  })
});
