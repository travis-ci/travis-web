import { sort } from '@ember/object/computed';
import Controller from '@ember/controller';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { controller } from 'ember-decorators/controller';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

const mixins = [LoadMoreBuildsMixin];

export default Controller.extend(...mixins, {
  @controller('repo') repoController: null,

  buildsSorting: ['number:desc'],
  builds: sort('model', 'buildsSorting'),

  @alias('repoController.repo') repo: null,
  @alias('repoController.tab') tab: null,
  @alias('model.isLoaded') isLoaded: null,
  @alias('model.isLoading') isLoading: null,

  @computed('tab', 'builds.lastObject.number')
  displayShowMoreButton(tab, lastBuildNumber) {
    return tab !== 'branches' && parseInt(lastBuildNumber) > 1;
  },
});
