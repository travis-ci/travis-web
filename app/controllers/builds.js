import { sort, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

const mixins = [LoadMoreBuildsMixin];

export default Controller.extend(...mixins, {
  tabStates: service(),

  buildsSorting: ['number:desc'],
  builds: sort('model', 'buildsSorting'),

  repoController: controller('repo'),
  repo: alias('repoController.repo'),
  tab: alias('repoController.tab'),

  displayShowMoreButton: computed('tab', 'builds.lastObject.number', function () {
    let tab = this.get('tab');
    let lastBuildNumber = this.get('builds.lastObject.number');
    return tab !== 'branches' && parseInt(lastBuildNumber) > 1;
  })
});
