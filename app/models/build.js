import { all } from 'rsvp';

import { isEmpty, isPresent } from '@ember/utils';
import configKeysMap from 'travis/utils/keys-map';
import Model from 'ember-data/model';
import DurationCalculations from 'travis/mixins/duration-calculations';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, sort } from '@ember/object/computed';

import moment from 'moment';

export default Model.extend(DurationCalculations, {
  api: service(),

  branchName: alias('branch.name'),

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

  request: belongsTo('request', { async: true }),

  jobs: hasMany('job', { async: true }),
  stages: hasMany('stage', { async: true }),

  stagesSort: ['number'],
  sortedStages: sort('stages', 'stagesSort'),

  createdBy: belongsTo('user'),

  stagesAreLoaded: alias('stages.isSettled'),

  config: computed('_config', 'currentState.stateName', function () {
    let config = this.get('_config');
    let stateName = this.get('currentState.stateName');

    if (config) {
      return Object.keys(config).reduce((compact, key) => {
        const value = config[key];
        if (isPresent(value)) compact[key] = value;
        return compact;
      });
    } else if (stateName !== 'root.loading') {
      if (this.get('isFetchingConfig')) {
        return;
      }
      this.set('isFetchingConfig', true);
      return this.reload();
    }
  }),

  isPullRequest: computed('eventType', function () {
    let eventType = this.get('eventType');
    return eventType === 'pull_request';
  }),

  isMatrix: computed('jobs.[]', function () {
    let jobs = this.get('jobs');
    return jobs.get('length') > 1;
  }),

  isTag: computed('tag', function () {
    let tag = this.get('tag');
    return (tag && tag.name);
  }),

  isFinished: computed('state', function () {
    let state = this.get('state');
    let finishedStates = ['passed', 'failed', 'errored', 'canceled'];
    return finishedStates.includes(state);
  }),

  notStarted: computed('state', function () {
    let state = this.get('state');
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  }),

  requiredJobs: computed('jobs.@each.allowFailure', function () {
    let jobs = this.get('jobs');
    return jobs.filter(job => !job.get('allowFailure'));
  }),

  allowedFailureJobs: computed('jobs.@each.allowFailure', function () {
    let jobs = this.get('jobs');
    return jobs.filter(job => job.get('allowFailure'));
  }),

  rawConfigKeys: computed('jobs.@each.config', function () {
    let jobs = this.get('jobs');
    const keys = [];
    jobs.forEach(job => {
      const configKeys = job.config || [];
      return configKeys.forEach(key => {
        if (!keys.includes(key) && configKeysMap.hasOwnProperty(key)) {
          return keys.pushObject(key);
        }
      });
    });
    return keys;
  }),

  configKeys: computed('rawConfigKeys.[]', function () {
    let keys = this.get('rawConfigKeys');
    const headers = ['Job', 'Duration', 'Finished'];
    return headers.concat(keys).map((key) => {
      if (configKeysMap.hasOwnProperty(key)) {
        return configKeysMap[key];
      } else {
        return key;
      }
    });
  }),

  canCancel: computed('jobs.@each.canCancel', function () {
    let jobs = this.get('jobs');
    return !isEmpty(jobs.filterBy('canCancel'));
  }),

  canRestart: alias('isFinished'),

  cancel() {
    const url = `/build/${this.get('id')}/cancel`;
    return this.get('api').post(url);
  },

  restart() {
    const url = `/build/${this.get('id')}/restart`;
    return this.get('api').post(url);
  },

  canDebug: computed('jobs.[]', 'repo.private', function () {
    let jobs = this.get('jobs');
    let repoPrivate = this.get('repo.private');
    return jobs.get('length') === 1 && repoPrivate;
  }),

  debug() {
    return all(this.get('jobs').map(job => job.debug()));
  },

  formattedFinishedAt: computed('finishedAt', function () {
    let finishedAt = this.get('finishedAt');
    if (finishedAt) {
      let m = moment(finishedAt);
      return m.isValid() ? m.format('lll') : 'not finished yet';
    }
  }),
});
