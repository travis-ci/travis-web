/* global Travis */

import { observer, computed } from '@ember/object';
import { Promise as EmberPromise } from 'rsvp';
import { isEqual } from '@ember/utils';
import { getOwner } from '@ember/application';

import Model from 'ember-data/model';
import Log from 'travis/models/log';
import DurationCalculations from 'travis/mixins/duration-calculations';
import DurationAttributes from 'travis/mixins/duration-attributes';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { alias, and, equal, not, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import promiseObject from 'travis/utils/promise-object';
import { on } from '@ember/object/evented';

export default Model.extend(DurationCalculations, DurationAttributes, {
  api: service(),
  ajax: service(),
  jobConfigFetcher: service(),
  features: service(),
  logId: attr(),
  queue: attr(),
  state: attr(),
  number: attr(),
  allowFailure: attr('boolean'),
  tags: attr(),
  repositoryPrivate: attr(),
  repositorySlug: attr(),
  updatedAt: attr('date'),
  _config: attr(),

  repo: belongsTo('repo'),
  build: belongsTo('build', { async: true }),
  commit: belongsTo('commit', { async: true }),
  stage: belongsTo('stage', { async: true }),

  isPullRequest: alias('build.isPullRequest'),
  pullRequestNumber: alias('build.pullRequestNumber'),
  pullRequestTitle: alias('build.pullRequestTitle'),
  branch: alias('build.branch'),
  branchName: alias('build.branchName'),
  isTag: alias('build.isTag'),
  tag: alias('build.tag'),
  eventType: alias('build.eventType'),

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
    // not(isFinished) is insufficient since it will be true when state is undefined.
    return !isFinished && !!state;
  }),

  canRestart: alias('isFinished'),
  canDebug: and('isFinished', 'repo.private'),

  cancel() {
    const url = `/job/${this.id}/cancel`;
    return this.api.post(url);
  },

  removeLog() {
    const url = `/job/${this.id}/log`;
    return this.ajax.deleteV3(url).then(() => this.reloadLog());
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

  whenLoaded(callback) {
    new EmberPromise((resolve, reject) => {
      this.whenLoadedCallbacks = this.whenLoadedCallbacks || [];
      if (this.isLoaded) {
        resolve();
      } else {
        this.whenLoadedCallbacks.push(resolve);
      }
    }).then(() => callback(this));
  },

  didLoad: on('didLoad', function () {
    (this.whenLoadedCallbacks || []).forEach((callback) => {
      callback(this);
    });
  }),

  subscribe() {
    // TODO: this is needed only because we may reach this place with a job that
    //       is not fully loaded yet. A better solution would be to ensure that
    //       we call subscribe only when the job is loaded, but I think that
    //       would require a bigger refactoring.
    this.whenLoaded(() => {
      if (this.subscribed) {
        return;
      }

      this.set('subscribed', true);

      this.repo.then((repo) =>
        Travis.pusher.subscribe(this.channelName)
      );
    });
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
    this.whenLoaded(() => {
      if (!this.subscribed) {
        return;
      }
      this.set('subscribed', false);
      if (Travis.pusher) {
        const channel = `job-${this.id}`;
        return Travis.pusher.unsubscribe(channel);
      }
    });
  },

  onStateChange: observer('state', function () {
    if (this.state === 'finished' && Travis.pusher) {
      return this.unsubscribe();
    }
  }),

  canRemoveLog: not('log.removed'),

  slug: computed('repo.slug', 'number', function () {
    let slug = this.get('repo.slug');
    let number = this.number;
    return `${slug} #${number}`;
  }),
});
