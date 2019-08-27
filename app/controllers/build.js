import Controller, { inject as controller } from '@ember/controller';
import Ember from 'ember';
import Polling from 'travis/mixins/polling';
import Visibility from 'visibilityjs';
import config from 'travis/config/environment';

import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { observer } from '@ember/object';

export default Controller.extend(Polling, {
  auth: service(),
  updateTimesService: service('updateTimes'),

  repoController: controller('repo'),

  config,

  repo: alias('repoController.repo'),
  currentUser: alias('auth.currentUser'),
  tab: alias('repoController.tab'),

  sendFaviconStateChanges: true,

  updateTimes() {
    this.updateTimesService.push(this.get('build.stages'));
  },

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      return Visibility.every(config.intervals.updateTimes, this.updateTimes.bind(this));
    }
  },

  buildStateDidChange: observer('build.state', function () {
    if (this.sendFaviconStateChanges) {
      this.send('faviconStateDidChange', this.get('build.state'));
    }
  })
});
