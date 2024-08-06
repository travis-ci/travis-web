import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { isEmpty, isPresent } from '@ember/utils';
import { all } from 'rsvp';
import moment from 'moment';
import configKeysMap from 'travis/utils/keys-map';
import DurationCalculations from 'travis/mixins/duration-calculations';

export default Model.extend(DurationCalculations, {
  api: service(),

  branchName: alias('branch.name'),

  permissions: attr(),

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

  repo: belongsTo('repo',  { async: true, inverse: null}),
  branch: belongsTo('branch', { async: false, inverse: 'builds' }),
  repoCurrentBuild: belongsTo('repo', { async: true, inverse: 'currentBuild' }),
  commit: belongsTo('commit', { async: false, inverse: 'build' }),

  request: belongsTo('request', { async: false, inverse: 'build' }),

  jobs: hasMany('job', { async: true, inverse: 'build' }),
  stages: hasMany('stage', { async: true, inverse: 'build' }),

  stagesSort: ['number'],
  sortedStages: sort('stages', 'stagesSort'),

  createdBy: belongsTo('user', { async: false, inverse: null}),

  stagesAreLoaded: alias('stages.isSettled'),

  priority: attr('boolean'),

  config: computed('_config', 'currentState.stateName', function () {
    let config = this._config;
    let stateName = this.get('currentState.stateName');

    if (config) {
      return Object.keys(config).reduce((compact, key) => {
        const value = config[key];
        if (isPresent(value)) compact[key] = value;
        return compact;
      });
    } else if (stateName !== 'root.loading') {
      if (this.isFetchingConfig) {
        return;
      }
      this.set('isFetchingConfig', true);
      return this.reload();
    }
  }),

  isPullRequest: computed('eventType', function () {
    let eventType = this.eventType;
    return eventType === 'pull_request';
  }),

  isMatrix: computed('jobs.[]', function () {
    let jobs = this.jobs;
    return jobs.get('length') > 1;
  }),

  isTag: computed('tag', function () {
    let tag = this.tag;
    return (tag && tag.name);
  }),

  isFinished: computed('state', function () {
    let state = this.state;
    let finishedStates = ['passed', 'failed', 'errored', 'canceled'];
    return finishedStates.includes(state);
  }),

  notStarted: computed('state', function () {
    let state = this.state;
    let waitingStates = ['queued', 'created', 'received'];
    return waitingStates.includes(state);
  }),

  requiredJobs: computed('jobs.@each.allowFailure', function () {
    let jobs = this.jobs;
    return jobs.filter(job => !job.get('allowFailure'));
  }),

  allowedFailureJobs: computed('jobs.@each.allowFailure', function () {
    let jobs = this.jobs;
    return jobs.filter(job => job.get('allowFailure'));
  }),

  rawConfigKeys: computed('jobs.@each.config', function () {
    let jobs = this.jobs;
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
    let keys = this.rawConfigKeys;
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
    let jobs = this.jobs;
    return !isEmpty(jobs.filterBy('canCancel'));
  }),

  canRestart: computed('isFinished', function () {
    return this.isFinished;
  }),

  cancel() {
    const url = `/build/${this.id}/cancel`;
    return this.api.post(url);
  },

  restart() {
    const url = `/build/${this.id}/restart`;
    return this.api.post(url);
  },

  restartedBy: computed('jobs.@each.restartedBy', function () {
    let jobs = this.jobs;
    if (jobs.get('length') == 1) {
      return jobs.firstObject.restartedBy;
    } else {
      return null;
    }
  }),

  canDebug: computed('jobs.[]', 'repo.private', function () {
    let jobs = this.jobs;
    let repoPrivate = this.get('repo.private');
    return jobs.get('length') === 1 && repoPrivate;
  }),

  debug() {
    return all(this.jobs.map(job => job.debug()));
  },

  formattedFinishedAt: computed('finishedAt', function () {
    let finishedAt = this.finishedAt;
    if (finishedAt) {
      let m = moment(finishedAt);
      return m.isValid() ? m.format('lll') : 'not finished yet';
    }
  }),

  increasePriority(shouldCancelRunningJobs) {
    let isCancelRunningJob = false;

    if (shouldCancelRunningJobs) {
      isCancelRunningJob = true;
    }

    const url = `/build/${this.id}/priority?cancel_all=${isCancelRunningJob}`;
    return this.api.post(url);
  },
});
