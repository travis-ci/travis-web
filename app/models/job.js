/* global Travis */

import { observer } from '@ember/object';
import { Promise as EmberPromise } from 'rsvp';
import { isEqual } from '@ember/utils';
import { getOwner } from '@ember/application';

import Model from 'ember-data/model';
import Log from 'travis/models/log';
import DurationCalculations from 'travis/mixins/duration-calculations';
import DurationAttributes from 'travis/mixins/duration-attributes';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
import { alias, not } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

import moment from 'moment';

export default Model.extend(DurationCalculations, DurationAttributes, {
  @service api: null,
  @service ajax: null,
  @service jobConfigFetcher: null,

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

  @alias('build.isPullRequest') isPullRequest: null,
  @alias('build.pullRequestNumber') pullRequestNumber: null,
  @alias('build.pullRequestTitle') pullRequestTitle: null,
  @alias('build.branch') branch: null,
  @alias('build.branchName') branchName: null,
  @alias('build.isTag') isTag: null,
  @alias('build.tag') tag: null,
  @alias('build.eventType') eventType: null,

  // TODO: DO NOT SET OTHER PROPERTIES WITHIN A COMPUTED PROPERTY!
  @computed()
  log() {
    this.set('isLogAccessed', true);
    return Log.create({
      job: this,
      api: this.get('api'),
      container: getOwner(this)
    });
  },

  @alias('config.content') configLoaded: null,

  @computed()
  config() {
    return this.get('jobConfigFetcher').fetch(this);
  },

  getCurrentState() {
    return this.get('currentState.stateName');
  },

  @computed('state')
  isFinished(state) {
    let finishedStates = ['passed', 'failed', 'errored', 'canceled'];
    return finishedStates.includes(state);
  },

  @computed('state')
  toBeQueued(state) {
    let queuedState = 'created';
    return isEqual(state, queuedState);
  },

  @computed('state')
  toBeStarted(state) {
    let waitingStates = ['queued', 'received'];
    return waitingStates.includes(state);
  },

  @computed('state')
  notStarted(state) {
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  },

  clearLog() {
    if (this.get('isLogAccessed')) {
      return this.get('log').clear();
    }
  },

  @computed('isFinished', 'state')
  canCancel(isFinished, state) {
    // not(isFinished) is insufficient since it will be true when state is undefined.
    return !isFinished && !!state;
  },

  @alias('isFinished') canRestart: null,
  @alias('isFinished') canDebug: null,

  cancel() {
    const url = `/job/${this.get('id')}/cancel`;
    return this.get('api').post(url);
  },

  removeLog() {
    const url = `/jobs/${this.get('id')}/log`;
    return this.get('ajax').patch(url).then(() => this.reloadLog());
  },

  reloadLog() {
    this.clearLog();
    return this.get('log').fetch();
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

  @computed('repo.private', 'id', 'features.enterpriseVersion')
  channelName(isRepoPrivate, id, enterprise) {
    // Currently always using private channels on Enterprise
    const usePrivateChannel = enterprise || isRepoPrivate;
    const prefix = usePrivateChannel ? 'private-job' : 'job';
    return `${prefix}-${id}`;
  },

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

  @computed('finishedAt')
  formattedFinishedAt(finishedAt) {
    if (finishedAt) {
      let m = moment(finishedAt);
      return m.isValid() ? m.format('lll') : 'not finished yet';
    }
  },

  @not('log.removed') canRemoveLog: null,

  @computed('repo.slug', 'number')
  slug(slug, number) {
    return `${slug} #${number}`;
  },
});
