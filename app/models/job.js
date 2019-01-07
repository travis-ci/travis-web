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

import moment from 'moment';

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
      api: this.get('api'),
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
    let state = this.get('state');
    let finishedStates = ['passed', 'failed', 'errored', 'canceled'];
    return finishedStates.includes(state);
  }),

  isCreated: equal('state', 'created'),

  isQueued: equal('state', 'queued'),

  isReceived: equal('state', 'received'),

  toBeQueued: computed('state', function () {
    let state = this.get('state');
    let queuedState = 'created';
    return isEqual(state, queuedState);
  }),

  toBeStarted: computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['queued', 'received'];
    return waitingStates.includes(state);
  }),

  notStarted: computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['created', 'queued', 'received'];
    return waitingStates.includes(state);
  }),

  clearLog() {
    if (this.get('isLogAccessed')) {
      return this.get('log').clear();
    }
  },

  canCancel: computed('isFinished', 'state', function () {
    let isFinished = this.get('isFinished');
    let state = this.get('state');
    // not(isFinished) is insufficient since it will be true when state is undefined.
    return !isFinished && !!state;
  }),

  canRestart: alias('isFinished'),
  canDebug: and('isFinished', 'repo.private'),

  cancel() {
    const url = `/job/${this.get('id')}/cancel`;
    return this.get('api').post(url);
  },

  removeLog() {
    const url = `/job/${this.get('id')}/log`;
    return this.get('ajax').deleteV3(url).then(() => this.reloadLog());
  },

  reloadLog() {
    this.clearLog();
    return this.get('log.fetchTask').perform();
  },

  restart() {
    const url = `/job/${this.get('id')}/restart`;
    return this.get('api').post(url);
  },

  debug() {
    const url = `/job/${this.get('id')}/debug`;
    return this.get('api').post(url, { data: { quiet: true } });
  },

  appendLog(part) {
    return this.get('log').append(part);
  },

  whenLoaded(callback) {
    new EmberPromise((resolve, reject) => {
      this.whenLoadedCallbacks = this.whenLoadedCallbacks || [];
      if (this.get('isLoaded')) {
        resolve();
      } else {
        this.whenLoadedCallbacks.push(resolve);
      }
    }).then(() => callback(this));
  },

  didLoad: function () {
    (this.whenLoadedCallbacks || []).forEach((callback) => {
      callback(this);
    });
  }.on('didLoad'),

  subscribe() {
    // TODO: this is needed only because we may reach this place with a job that
    //       is not fully loaded yet. A better solution would be to ensure that
    //       we call subscribe only when the job is loaded, but I think that
    //       would require a bigger refactoring.
    this.whenLoaded(() => {
      if (this.get('subscribed')) {
        return;
      }

      this.set('subscribed', true);

      this.get('repo').then((repo) =>
        Travis.pusher.subscribe(this.get('channelName'))
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
      let id = this.get('id');
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
      if (!this.get('subscribed')) {
        return;
      }
      this.set('subscribed', false);
      if (Travis.pusher) {
        const channel = `job-${this.get('id')}`;
        return Travis.pusher.unsubscribe(channel);
      }
    });
  },

  onStateChange: observer('state', function () {
    if (this.get('state') === 'finished' && Travis.pusher) {
      return this.unsubscribe();
    }
  }),

  formattedFinishedAt: computed('finishedAt', function () {
    let finishedAt = this.get('finishedAt');
    if (finishedAt) {
      let m = moment(finishedAt);
      return m.isValid() ? m.format('lll') : 'not finished yet';
    }
  }),

  canRemoveLog: not('log.removed'),

  slug: computed('repo.slug', 'number', function () {
    let slug = this.get('repo.slug');
    let number = this.get('number');
    return `${slug} #${number}`;
  }),
});
