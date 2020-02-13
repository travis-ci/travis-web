import { sort, alias, not, reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { computed } from '@ember/object';

const mixins = [LoadMoreBuildsMixin];

export default Controller.extend(...mixins, {
  repoController: controller('repo'),

  buildsSorting: ['number:desc'],
  buildsValue: reads('model.lastSuccessful.value'),
  builds: sort('buildsValue', 'buildsSorting'),

  repo: alias('repoController.repo'),
  tab: alias('repoController.tab'),
  isLoaded: not('isLoading'),
  isLoading: reads('model.isRunning'),

  displayShowMoreButton: computed('tab', 'builds.lastObject.number', function () {
    let tab = this.tab;
    let lastBuildNumber = this.get('builds.lastObject.number');
    return tab !== 'branches' && parseInt(lastBuildNumber) > 1;
  })
});
