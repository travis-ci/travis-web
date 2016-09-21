/* global moment, Travis */
import { compact } from 'travis/utils/helpers';
import Ember from 'ember';
import Model from 'ember-data/model';
import Log from 'travis/models/log';
import DurationCalculations from 'travis/mixins/duration-calculations';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

const { service } = Ember.inject;

export default Model.extend(DurationCalculations, {
  ajax: service(),
  logId: attr(),
  queue: attr(),
  state: attr(),
  number: attr(),
  _startedAt: attr(),
  _finishedAt: attr(),
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

  pullRequest: Ember.computed.alias('build.pullRequest'),
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

  startedAt: Ember.computed('_startedAt', 'notStarted', function () {
    if (!this.get('notStarted')) {
      return this.get('_startedAt');
    }
  }),

  finishedAt: Ember.computed('_finishedAt', 'notStarted', function () {
    if (!this.get('notStarted')) {
      return this.get('_finishedAt');
    }
  }),

  repoSlug: Ember.computed('repositorySlug', function () {
    return this.get('repositorySlug');
  }),

  config: Ember.computed('_config', function () {
    let config = this.get('_config');
    if (config) {
      return compact(config);
    } else if (this.get('currentState.stateName') !== 'root.loading') {
      if (this.get('isFetchingConfig')) {
        return;
      }
      this.set('isFetchingConfig', true);
      return this.reload();
    }
  }),

  isFinished: Ember.computed('state', function () {
    let state = this.get('state');
    let finishedStates = ['passed', 'failed', 'errored', 'canceled'];
    return finishedStates.contains(state);
  }),

  notStarted: Ember.computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.contains(state);
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

  canCancel: Ember.computed('isFinished', function () {
    return !this.get('isFinished');
  }),

  canRestart: Ember.computed.alias('isFinished'),

  cancel() {
    return this.get('ajax').post('/jobs/' + (this.get('id')) + '/cancel');
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
    return this.get('ajax').post('/v3/job/' + (this.get('id')) + '/restart');
  },

  debug() {
    return this.get('ajax').ajax(`/job/${this.get('id')}/debug`, 'POST', {
      data: {
        quiet: true
      },
      headers: {
        'Travis-API-Version': '3'
      }
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
    if (Travis.pusher) {
      return Travis.pusher.subscribe('job-' + (this.get('id')));
    }
  },

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
  }),

  isLegacyInfrastructure: Ember.computed('queue', function () {
    if (this.get('queue') === 'builds.linux') {
      return true;
    }
  }),

  displayGceNotice: Ember.computed('queue', 'config.dist', function () {
    if (this.get('queue') === 'builds.gce' && this.get('config.dist') === 'precise') {
      return true;
    } else {
      return false;
    }
  })
});
