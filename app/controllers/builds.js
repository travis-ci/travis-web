import Ember from 'ember';
import LoadMoreBuildsMixin from 'travis/mixins/builds/load-more';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

const mixins = [LoadMoreBuildsMixin];

export default Ember.Controller.extend(...mixins, {
  @service tabStates: null,

  buildsSorting: ['number:desc'],
  builds: Ember.computed.sort('model', 'buildsSorting'),

  @controller('repo') repoController: null,
  @alias('repoController.repo') repo: null,
  @alias('repoController.tab') tab: null,

  @computed('tab', 'builds.lastObject.number')
  displayShowMoreButton(tab, lastBuildNumber) {
    return tab !== 'branches' && parseInt(lastBuildNumber) > 1;
  },
});
