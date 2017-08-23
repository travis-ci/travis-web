/* global moment, Travis, Pusher */

import pickBy from 'npm:lodash.pickby';
import Ember from 'ember';
import Model from 'ember-data/model';
import Log from 'travis/models/log';
import DurationCalculations from 'travis/mixins/duration-calculations';
import DurationAttributes from 'travis/mixins/duration-attributes';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from 'ember-decorators/object';
import { alias, not } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Model.extend(DurationCalculations, DurationAttributes, {
  @service ajax: null,

  logId: attr(),
  queue: attr(),
  state: attr(),
  number: attr(),
  allowFailure: attr('boolean'),
  tags: attr(),
  repositoryPrivate: attr(),
  repositorySlug: attr(),
  _config: attr(),

  repo: belongsTo('repo'),
  build: belongsTo('build', { async: true }),
  commit: belongsTo('commit', { async: true }),
  stage: belongsTo('stage', { async: false }),

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
      ajax: this.get('ajax'),
      container: Ember.getOwner(this)
    });
  },

  // TODO: DO NOT SET OTHER PROPERTIES WITHIN A COMPUTED PROPERTY!
  @computed('_config')
  config(config) {
    if (config) {
      return pickBy(config);
    } else {
      let fetchConfig = () => {
        if (this.getCurrentState() !== 'root.loading') {
          if (this.get('isFetchingConfig')) {
            return;
          }
          this.set('isFetchingConfig', true);
          this.reload();
        } else {
          Ember.run.later(fetchConfig, 20);
        }
      };

      fetchConfig();
    }
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
    return Ember.isEqual(state, queuedState);
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

  @computed('config', 'build.rawConfigKeys.[]')
  configValues(config, keys) {
    if (config && keys) {
      return keys.map(key => config[key]);
    }
    return [];
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
    return this.get('ajax').postV3(url);
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
    return this.get('ajax').postV3(url);
  },

  debug() {
    const url = `/job/${this.get('id')}/debug`;
    return this.get('ajax').postV3(url, { quiet: true });
  },

  appendLog(part) {
    return this.get('log').append(part);
  },

  subscribe() {
    if (this.get('subscribed')) {
      return;
    }

    this.set('subscribed', true);

    if (this.get('repo.private')) {
      if (Travis.pusher && Travis.pusher.ajaxService) {
        return Travis.pusher.ajaxService.post(Pusher.channel_auth_endpoint, {
          socket_id: Travis.pusher.pusherSocketId,
          channels: [`private-job-${this.get('id')}`]
        }).then(() => Travis.pusher.subscribe(this.get('channelName')));
      }
    } else {
      return Travis.pusher.subscribe(this.get('channelName'));
    }
  },

  @computed('repo.private', 'id')
  channelName(isRepoPrivate, id) {
    const prefix = isRepoPrivate ? 'private-job' : 'job';
    return `${prefix}-${id}`;
  },

  unsubscribe() {
    if (!this.get('subscribed')) {
      return;
    }
    this.set('subscribed', false);
    if (Travis.pusher) {
      const channel = `job-${this.get('id')}`;
      return Travis.pusher.unsubscribe(channel);
    }
  },

  onStateChange: Ember.observer('state', function () {
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
