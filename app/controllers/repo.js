import { isEmpty } from '@ember/utils';
import Controller, { inject as controller } from '@ember/controller';
import Ember from 'ember';
import Visibility from 'visibilityjs';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import {
  and,
  equal,
  not,
  or,
  reads
} from '@ember/object/computed';
import config from 'travis/config/environment';
import { MAIN_TAB } from 'travis/services/tab-states';

const { updateTimes: updateTimesInterval } = config.intervals;

export default Controller.extend({
  classNames: ['repo'],

  auth: service(),
  repositories: service(),
  tabStates: service(),
  features: service(),
  updateTimesService: service('updateTimes'),

  repo: reads('model'),

  queryParams: ['migrationStatus'],
  migrationStatus: null,

  isCurrentTab: equal('tabStates.mainTab', MAIN_TAB.CURRENT),

  repos: reads('repositories.accessible'),
  isEmpty: and('repos.isLoaded', 'repos.length'),

  currentUser: reads('auth.currentUser'),
  isNotSignedIn: not('auth.signedIn'),

  isCentered: or('isNotSignedIn', 'features.dashboard'),

  showGitHubApps: reads('features.github-apps'),

  showGitHubAppsCTA: computed('showGitHubApps', 'repo.private', 'currentUser', function () {
    let showGitHubApps = this.showGitHubApps;
    let isPrivate = this.get('repo.private');
    let currentUser = this.currentUser;
    return showGitHubApps && !isPrivate && !currentUser;
  }),

  init() {
    this._super(...arguments);
    if (!Ember.testing) {
      Visibility.every(updateTimesInterval, () => this.updateTimes());
    }
  },

  updateTimes() {
    let updateTimesService = this.updateTimesService;

    updateTimesService.push(this.build);
    updateTimesService.push(this.builds);
    updateTimesService.push(this.get('build.jobs'));
  },

  activate(action) {
    if (['index', 'current'].includes(action)) {
      this.tabStates.switchMainTabToCurrent();
    } else {
      this.tabStates.switchMainTab(action);
    }
  },
});
