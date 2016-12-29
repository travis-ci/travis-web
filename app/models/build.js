/* global moment */
import { configKeys, compact } from 'travis/utils/helpers';
import configKeysMap from 'travis/utils/keys-map';
import Ember from 'ember';
import Model from 'ember-data/model';
import DurationCalculations from 'travis/mixins/duration-calculations';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

const { service } = Ember.inject;
var Build;

Build = Model.extend(DurationCalculations, {
  branch: belongsTo('branch', { async: false, inverse: 'builds' }),
  branchName: Ember.computed.alias('branch.name')
});

Build.reopen({
  ajax: service(),
  state: attr(),
  number: attr('number'),
  message: attr('string'),
  _duration: attr('number'),
  _config: attr(),
  _startedAt: attr(),
  _finishedAt: attr('string'),
  pullRequest: attr('boolean'),
  pullRequestTitle: attr(),
  pullRequestNumber: attr('number'),
  eventType: attr('string'),
  repo: belongsTo('repo', { async: true }),
  repoCurrentBuild: belongsTo('repo', { async: true, inverse: 'currentBuild' }),
  commit: belongsTo('commit', { async: false }),
  jobs: hasMany('job', { async: true }),

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

  isPullRequest: Ember.computed('eventType', function () {
    return this.get('eventType') === 'pull_request' || this.get('pullRequest');
  }),

  isMatrix: Ember.computed('jobs.length', function () {
    return this.get('jobs.length') > 1;
  }),

  isFinished: Ember.computed('state', function () {
    let state = this.get('state');
    let finishedStates = ['passed', 'failed', 'errored', 'canceled'];
    return finishedStates.includes(state);
  }),

  notStarted: Ember.computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
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

  requiredJobs: Ember.computed('jobs.@each.allowFailure', function () {
    return this.get('jobs').filter(function (data) {
      return !data.get('allowFailure');
    });
  }),

  allowedFailureJobs: Ember.computed('jobs.@each.allowFailure', function () {
    return this.get('jobs').filter(function (data) {
      return data.get('allowFailure');
    });
  }),

  rawConfigKeys: Ember.computed('config', 'jobs.@each.config', function () {
    var keys;
    keys = [];
    this.get('jobs').forEach(function (job) {
      return configKeys(job.get('config')).forEach(function (key) {
        if (!keys.includes(key)) {
          return keys.pushObject(key);
        }
      });
    });
    return keys;
  }),

  configKeys: Ember.computed('rawConfigKeys.length', function () {
    var headers, keys;
    keys = this.get('rawConfigKeys');
    headers = ['Job', 'Duration', 'Finished'];
    return headers.concat(keys).map(function (key) {
      if (configKeysMap.hasOwnProperty(key)) {
        return configKeysMap[key];
      } else {
        return key;
      }
    });
  }),

  canCancel: Ember.computed('jobs.@each.canCancel', 'jobs', 'jobs.[]', function () {
    return this.get('jobs').filterBy('canCancel', true).length;
  }),

  canRestart: Ember.computed.alias('isFinished'),

  cancel() {
    return this.get('ajax').postV3('/build/' + (this.get('id')) + '/cancel');
  },

  restart() {
    return this.get('ajax').postV3(`/build/${this.get('id')}/restart`);
  },

  canDebug: Ember.computed('jobs.length', function () {
    return this.get('jobs.length') === 1;
  }),

  debug() {
    return Ember.RSVP.all(this.get('jobs').map(job => job.debug()));
  },

  formattedFinishedAt: Ember.computed('finishedAt', function () {
    let finishedAt = this.get('finishedAt');
    if (finishedAt) {
      var m = moment(finishedAt);
      return m.isValid() ? m.format('lll') : 'not finished yet';
    }
  })

});

export default Build;
