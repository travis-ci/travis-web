/* global Travis */

import Model, { attr, belongsTo } from '@ember-data/model';
import { observer, computed } from '@ember/object';
import { alias, and, equal, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import { getOwner } from '@ember/application';
import Log from 'travis/models/log';
import DurationCalculations from 'travis/mixins/duration-calculations';
import DurationAttributes from 'travis/mixins/duration-attributes';
import promiseObject from 'travis/utils/promise-object';

export const OSX_VERSIONS = {
  'xcode11.3': '10.14',
  'xcode11.2': '10.14',
  'xcode11.1': '10.14',
  'xcode11': '10.14',
  'xcode10.3': '10.14.4',
  'xcode10.2': '10.14',
  'xcode10.1': '10.13',
  'xcode10': '10.13',
  'xcode9.4': '10.13',
  'xcode9.3': '10.13',
  'xcode9.2': '10.12',
  'xcode9.1': '10.12',
  'xcode9': '10.12',
  'xcode8.3': '10.12',
  'xcode8': '10.11',
  'xcode7.3': '10.11',
  'xcode6.4': '10.10',
};

export default Model.extend(DurationCalculations, DurationAttributes, {
  api: service(),
  jobConfigFetcher: service(),
  features: service(),
  logId: attr(),
  queue: attr(),
  state: attr(),
  number: attr(),
  jobIdNumber: attr(),
  allowFailure: attr('boolean'),
  tags: attr(),
  repositoryPrivate: attr(),
  repositorySlug: attr(),
  updatedAt: attr('date'),
  _config: attr(),

  repo: belongsTo('repo', { async: true, inverse: null }),
  build: belongsTo('build', { async: true, inverse: 'jobs'  }),
  commit: belongsTo('commit', { async: true, inverse: null }),
  stage: belongsTo('stage', { async: true, inverse: null }),

  isPullRequest: alias('build.isPullRequest'),
  pullRequestNumber: alias('build.pullRequestNumber'),
  pullRequestTitle: alias('build.pullRequestTitle'),
  branch: alias('build.branch'),
  branchName: alias('build.branchName'),
  isTag: alias('build.isTag'),
  tag: alias('build.tag'),
  eventType: alias('build.eventType'),

  restartedBy: attr(),
  vmSize: attr(),

  jobNumber: computed('number', 'jobIdNumber', function () {
    return this.jobIdNumber ? this.jobIdNumber : this.number;
  }),

  // TODO: DO NOT SET OTHER PROPERTIES WITHIN A COMPUTED PROPERTY!
  log: computed(function () {
    this.set('isLogAccessed', true);
    return Log.create({
      job: this,
      api: this.api,
      container: getOwner(this)
    });
  }),

  config: computed(function () {
    return promiseObject(this.jobConfigFetcher.fetch(this));
  }),

  isConfigLoaded: reads('config.isFulfilled'),

  os: computed('config.content.os', function () {
    const os = this.get('config.content.os');

    if (os === 'linux' || os === 'linux-ppc64le') {
      return 'linux';
    } else if (os === 'freebsd') {
      return 'freebsd';
    } else if (os === 'osx') {
      return 'osx';
    } else if (os === 'windows') {
      return 'windows';
    } else {
      return 'unknown';
    }
  }),

  dist: reads('config.content.dist'),
  osxImage: reads('config.content.osx_image'),

  osVersion: computed('os', 'dist', 'osxImage', function () {
    const { os, dist, osxImage } = this;
    if (os === 'osx') {
      return OSX_VERSIONS[osxImage];
    } else {
      return dist;
    }
  }),

  getCurrentState() {
    return this.get('currentState.stateName');
  },

  isFinished: computed('state', function () {
    let state = this.state;
    let finishedStates = ['passed', 'failed', 'errored', 'canceled'];
    return finishedStates.includes(state);
  }),

  isCreated: equal('state', 'created'),

  isQueued: equal('state', 'queued'),

  isReceived: equal('state', 'received'),

  toBeQueued: computed('state', function () {
    let state = this.state;
    let queuedState = 'created';
    return isEqual(state, queuedState);
  }),

  toBeStarted: computed('state', function () {
    let state = this.state;
    let waitingStates = ['queued', 'received'];
    return waitingStates.includes(state);
  }),

  notStarted: computed('state', function () {
    let state = this.state;
    let waitingStates = ['created', 'queued', 'received'];
    return waitingStates.includes(state);
  }),

  clearLog() {
    if (this.isLogAccessed) {
      return this.log.clear();
    }
  },

  canCancel: computed('isFinished', 'state', function () {
    let isFinished = this.isFinished;
    let state = this.state;
    return !isFinished && !!state;
  }),

  canRestart: computed('isFinished', function () {
    let isFinished = this.isFinished;
    return isFinished;
  }),
  canDebug: and('isFinished', 'repo.private'),

  cancel() {
    const url = `/job/${this.id}/cancel`;
    return this.api.post(url);
  },

  removeLog() {
    const url = `/job/${this.id}/log`;
    return this.api.delete(url).then(() => this.reloadLog());
  },

  reloadLog() {
    this.clearLog();
    return this.get('log.fetchTask').perform();
  },

  restart() {
    const url = `/job/${this.id}/restart`;
    return this.api.post(url);
  },

  debug() {
    const url = `/job/${this.id}/debug`;
    return this.api.post(url, { data: { quiet: true } });
  },

  appendLog(part) {
    return this.log.append(part);
  },

  subscribe() {
    if (this.subscribed) {
      return;
    }

    this.set('subscribed', true);

    return this.repo.then(repo => Travis.pusher.subscribe(this.channelName));
  },

  channelName: computed(
    'repo.private',
    'id',
    'features.enterpriseVersion',
    'features.proVersion',
    function () {
      let isRepoPrivate = this.get('repo.private');
      let id = this.id;
      let enterprise = this.get('features.enterpriseVersion');
      let pro = this.get('features.proVersion');
      // Currently always using private channels on Enterprise
      const usePrivateChannel = enterprise || isRepoPrivate || pro;
      const prefix = usePrivateChannel ? 'private-job' : 'job';
      return `${prefix}-${id}`;
    }
  ),

  unsubscribe() {
    if (!this.subscribed) {
      return;
    }
    this.set('subscribed', false);
    if (Travis.pusher) {
      const channel = `job-${this.id}`;
      return Travis.pusher.unsubscribe(channel);
    }
  },

  onStateChange: observer('state', function () {
    if (this.state === 'finished' && Travis.pusher) {
      return this.unsubscribe();
    }
  }),

  canRemoveLog: computed('log.removed', function () {
    let removed = !!this.log.removed;
    return !removed;
  }),

  slug: computed('repo.slug', 'number', function () {
    let slug = this.get('repo.slug');
    let number = this.number;
    return `${slug} #${number}`;
  }),

  didLoad() {
    if (this.number)
      this.set('jobIdNumber', this.number);
  }
});
