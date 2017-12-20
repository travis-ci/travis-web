import { all } from 'rsvp';

import { isEmpty } from '@ember/utils';
import safelistedConfigKeys from 'travis/utils/safelisted-config-keys';
import pickBy from 'npm:lodash.pickby';
import configKeysMap from 'travis/utils/keys-map';
import Model from 'ember-data/model';
import DurationCalculations from 'travis/mixins/duration-calculations';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

import moment from 'moment';

export default Model.extend(DurationCalculations, {
  @service api: null,

  @alias('branch.name') branchName: null,

  state: attr(),
  number: attr('number'),
  message: attr('string'),
  _duration: attr('number'),
  startedAt: attr('string'),
  finishedAt: attr('string'),
  pullRequestNumber: attr('number'),
  pullRequestTitle: attr('string'),
  tag: attr(),
  eventType: attr('string'),
  _config: attr(),
  updatedAt: attr('date'),

  repo: belongsTo('repo'),
  branch: belongsTo('branch', { async: false, inverse: 'builds' }),
  repoCurrentBuild: belongsTo('repo', { async: true, inverse: 'currentBuild' }),
  commit: belongsTo('commit', { async: false }),

  jobs: hasMany('job', { async: true }),
  stages: hasMany('stage', { async: true }),

  @alias('stages.isSettled') stagesAreLoaded: null,

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

  @computed('tag')
  isTag(tag) {
    return (tag && tag.name);
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
      const configKeys = safelistedConfigKeys(job.get('config'));
      return configKeys.forEach((key) => {
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
    return !isEmpty(jobs.filterBy('canCancel'));
  },

  @alias('isFinished') canRestart: null,

  cancel() {
    const url = `/build/${this.get('id')}/cancel`;
    return this.get('api').post(url);
  },

  restart() {
    const url = `/build/${this.get('id')}/restart`;
    return this.get('api').post(url);
  },

  @computed('jobs.[]')
  canDebug(jobs) {
    return jobs.get('length') === 1;
  },

  debug() {
    return all(this.get('jobs').map(job => job.debug()));
  },

  @computed('finishedAt')
  formattedFinishedAt(finishedAt) {
    if (finishedAt) {
      let m = moment(finishedAt);
      return m.isValid() ? m.format('lll') : 'not finished yet';
    }
  },
});
