import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import GithubUrlProperties from 'travis/mixins/github-url-properties';
import Visibility from 'npm:visibilityjs';
import config from 'travis/config/environment';

import { controller } from 'ember-decorators/controller';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Controller.extend(GithubUrlProperties, Polling, {
  @service auth: null,
  @service('updateTimes') updateTimesService: null,

  @controller('repo') repoController: null,

  @alias('repoController.repo') repo: null,
  @alias('auth.currentUser') currentUser: null,
  @alias('repoController.tab') tab: null,

  sendFaviconStateChanges: true,

  updateTimes() {
    this.get('updateTimesService').push(this.get('build.stages'));
  },

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },
});
