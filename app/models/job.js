/* global moment, Travis, Pusher */

import _object from 'lodash/object';
import Ember from 'ember';
import Model from 'ember-data/model';
import Log from 'travis/models/log';
import DurationCalculations from 'travis/mixins/duration-calculations';
import DurationAttributes from 'travis/mixins/duration-attributes';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import computed from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Model.extend(DurationCalculations, DurationAttributes, {
  ajax: service(),
  logId: attr(),
  queue: attr(),
  state: attr(),
  number: attr(),
  allowFailure: attr('boolean'),
  tags: attr(),
  repositoryPrivate: attr(),
  repositorySlug: attr(),
  _config: attr(),

  repo: belongsTo('repo', { async: true }),
  build: belongsTo('build', { async: true }),
  commit: belongsTo('commit', { async: true }),
  branch: Ember.computed.alias('build.branch'),
  branchName: Ember.computed.alias('build.branchName'),

  stage: belongsTo('stage', { async: false }),

  isPullRequest: Ember.computed.alias('build.isPullRequest'),
  pullRequestNumber: Ember.computed.alias('build.pullRequestNumber'),
  pullRequestTitle: Ember.computed.alias('build.pullRequestTitle'),

  log: Ember.computed(function () {
    this.set('isLogAccessed', true);
    return Log.create({
      job: this,
      ajax: this.get('ajax'),
      container: Ember.getOwner(this)
    });
  }),

  repoSlug: Ember.computed('repositorySlug', function () {
    return this.get('repositorySlug');
  }),

  config: Ember.computed('_config', function () {
    let config = this.get('_config');
    if (config) {
      return _object.pickBy(config);
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
  }),

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

  notStarted: Ember.computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  }),

  clearLog() {
    if (this.get('isLogAccessed')) {
      return this.get('log').clear();
    }
  },

  configValues: Ember.computed('config', 'build.rawConfigKeys.length', function () {
    var config, keys;
    config = this.get('config');
    keys = this.get('build.rawConfigKeys');
    if (config && keys) {
      return keys.map(function (key) {
        return config[key];
      });
    } else {
      return [];
    }
  }),


  canCancel: Ember.computed('isFinished', 'state', function () {
    // not(isFinished) is insufficient since it will be true when state is undefined.
    return !this.get('isFinished') && !!this.get('state');
  }),

  canRestart: Ember.computed.alias('isFinished'),
  canDebug: Ember.computed.alias('isFinished'),

  cancel() {
    return this.get('ajax').postV3('/job/' + (this.get('id')) + '/cancel');
  },

  removeLog() {
    return this.get('ajax').patch('/jobs/' + (this.get('id')) + '/log').then(() => {
      return this.reloadLog();
    });
  },

  reloadLog() {
    this.clearLog();
    return this.get('log').fetch();
  },

  restart() {
    return this.get('ajax').postV3('/job/' + (this.get('id')) + '/restart');
  },

  debug() {
    return this.get('ajax').postV3(`/job/${this.get('id')}/debug`, {
      quiet: true
    });
  },

  appendLog(part) {
    return this.get('log').append(part);
  },

  subscribe() {
    if (this.get('subscribed')) {
      return;
    }

    this.set('subscribed', true);

    if (this.get('features.proVersion')) {
      if (Travis.pusher && Travis.pusher.ajaxService) {
        return Travis.pusher.ajaxService.post(Pusher.channel_auth_endpoint, {
          socket_id: Travis.pusher.pusherSocketId,
          channels: ['private-job-' + this.get('id')]
        }).then(() => {
          return Travis.pusher.subscribe(this.get('channelName'));
        });
      }
    } else {
      return Travis.pusher.subscribe(this.get('channelName'));
    }
  },

  channelName: Ember.computed('features.proVersion', 'id', function () {
    const prefix = this.get('features.proVersion') ? 'private-job' : 'job';
    return `${prefix}-${this.get('id')}`;
  }),

  unsubscribe() {
    if (!this.get('subscribed')) {
      return;
    }
    this.set('subscribed', false);
    if (Travis.pusher) {
      return Travis.pusher.unsubscribe('job-' + (this.get('id')));
    }
  },

  onStateChange: Ember.observer('state', function () {
    if (this.get('state') === 'finished' && Travis.pusher) {
      return this.unsubscribe();
    }
  }),

  formattedFinishedAt: Ember.computed('finishedAt', function () {
    let finishedAt = this.get('finishedAt');
    if (finishedAt) {
      var m = moment(finishedAt);
      return m.isValid() ? m.format('lll') : 'not finished yet';
    }
  }),

  canRemoveLog: Ember.computed('log.removed', function () {
    return !this.get('log.removed');
  }),

  slug: Ember.computed(function () {
    return (this.get('repo.slug')) + ' #' + (this.get('number'));
  })
});
