/* global moment */
import safelistedConfigKeys from 'travis/utils/safelisted-config-keys';
import _object from 'lodash/object';
import configKeysMap from 'travis/utils/keys-map';
import Ember from 'ember';
import Model from 'ember-data/model';
import DurationCalculations from 'travis/mixins/duration-calculations';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

const { service } = Ember.inject;

export default Model.extend(DurationCalculations, {
  ajax: service(),

  branch: belongsTo('branch', { async: false, inverse: 'builds' }),
  branchName: Ember.computed.alias('branch.name'),
  state: attr(),
  number: attr('number'),
  message: attr('string'),
  _duration: attr('number'),
  startedAt: attr('string'),
  finishedAt: attr('string'),
  pullRequestNumber: attr('number'),
  pullRequestTitle: attr('string'),
  eventType: attr('string'),
  repo: belongsTo('repo', { async: true }),
  repoCurrentBuild: belongsTo('repo', { async: true, inverse: 'currentBuild' }),
  commit: belongsTo('commit', { async: false }),
  jobs: hasMany('job', { async: true }),
  stages: hasMany('stage', { async: false }),
  _config: attr(),

  config: Ember.computed('_config', function () {
    let config = this.get('_config');
    if (config) {
      return _object.pickBy(config);
    } else if (this.get('currentState.stateName') !== 'root.loading') {
      if (this.get('isFetchingConfig')) {
        return;
      }
      this.set('isFetchingConfig', true);
      return this.reload();
    }
  }),

  isPullRequest: Ember.computed('eventType', function () {
    return this.get('eventType') === 'pull_request';
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
      return safelistedConfigKeys(job.get('config')).forEach(function (key) {
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

  canCancel: Ember.computed('jobs.@each.canCancel', 'jobs.[]', function () {
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
