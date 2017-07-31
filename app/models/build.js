/* global moment */
import safelistedConfigKeys from 'travis/utils/safelisted-config-keys';
import pickBy from 'npm:lodash.pickby';
import configKeysMap from 'travis/utils/keys-map';
import Ember from 'ember';
import Model from 'ember-data/model';
import DurationCalculations from 'travis/mixins/duration-calculations';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Model.extend(DurationCalculations, {
  @service ajax: null,

  @alias('branch.name') branchName: null,

  state: attr(),
  number: attr('number'),
  message: attr('string'),
  _duration: attr('number'),
  startedAt: attr('string'),
  finishedAt: attr('string'),
  pullRequestNumber: attr('number'),
  pullRequestTitle: attr('string'),
  eventType: attr('string'),
  _config: attr(),

  repo: belongsTo('repo', { async: true }),
  branch: belongsTo('branch', { async: false, inverse: 'builds' }),
  repoCurrentBuild: belongsTo('repo', { async: true, inverse: 'currentBuild' }),
  commit: belongsTo('commit', { async: false }),

  jobs: hasMany('job', { async: true }),
  stages: hasMany('stage', { async: true }),

  @computed('_config', 'currentState.stateName')
  config(config, stateName) {
    if (config) {
      return pickBy(config);
    } else if (stateName !== 'root.loading') {
      if (this.get('isFetchingConfig')) {
        return;
      }
      this.set('isFetchingConfig', true);
      return this.reload();
    }
  },

  @computed('eventType')
  isPullRequest(eventType) {
    return eventType === 'pull_request';
  },

  @computed('jobs.[]')
  isMatrix(jobs) {
    return jobs.get('length') > 1;
  },

  @computed('state')
  isFinished(state) {
    let finishedStates = ['passed', 'failed', 'errored', 'canceled'];
    return finishedStates.includes(state);
  },

  @computed('state')
  notStarted(state) {
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  },

  @computed('jobs.@each.allowFailure')
  requiredJobs(jobs) {
    return jobs.filter(job => !job.get('allowFailure'));
  },

  @computed('jobs.@each.allowFailure')
  allowedFailureJobs(jobs) {
    return jobs.filter(job => job.get('allowFailure'));
  },

  @computed('jobs.@each.config')
  rawConfigKeys(jobs) {
    let keys = [];
    jobs.forEach((job) => {
      return safelistedConfigKeys(job.get('config')).forEach((key) => {
        if (!keys.includes(key)) {
          return keys.pushObject(key);
        }
      });
    });
    return keys;
  },

  @computed('rawConfigKeys.[]')
  configKeys(keys) {
    const headers = ['Job', 'Duration', 'Finished'];
    return headers.concat(keys).map((key) => {
      if (configKeysMap.hasOwnProperty(key)) {
        return configKeysMap[key];
      } else {
        return key;
      }
    });
  },

  @computed('jobs.@each.canCancel')
  canCancel(jobs) {
    return !Ember.isEmpty(jobs.filterBy('canCancel'));
  },

  @alias('isFinished') canRestart: null,

  cancel() {
    return this.get('ajax').postV3('/build/' + (this.get('id')) + '/cancel');
  },

  restart() {
    return this.get('ajax').postV3(`/build/${this.get('id')}/restart`);
  },

  @computed('jobs.[]')
  canDebug(jobs) {
    return jobs.get('length') === 1;
  },

  debug() {
    return Ember.RSVP.all(this.get('jobs').map(job => job.debug()));
  },

  @computed('finishedAt')
  formattedFinishedAt(finishedAt) {
    if (finishedAt) {
      var m = moment(finishedAt);
      return m.isValid() ? m.format('lll') : 'not finished yet';
    }
  },
});
