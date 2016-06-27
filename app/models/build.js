import { durationFrom, configKeys, compact } from 'travis/utils/helpers';
import configKeysMap from 'travis/utils/keys-map';
import Ember from 'ember';
import Model from 'travis/models/model';
import DurationCalculations from 'travis/mixins/duration-calculations';
import Config from 'travis/config/environment';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

const { service } = Ember.inject;
var Build;

if (Config.useV3API) {
  Build = Model.extend(DurationCalculations, {
    branch: belongsTo('branch', { async: false, inverse: 'builds' }),
    branchName: Ember.computed.alias('branch.name')
  });
} else {
  Build = Model.extend(DurationCalculations, {
    branchName: Ember.computed.alias('commit.branch'),
    // this is not used in V2, but makes it easier to test serializers
    branch: belongsTo('branch', { async: false, inverse: 'builds' }),
  });
}

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
  commit: belongsTo('commit', { async: false }),
  jobs: hasMany('job', { async: true }),

  config: function() {
    var config;
    if (config = this.get('_config')) {
      return compact(config);
    } else if (this.get('currentState.stateName') !== 'root.loading') {
      if (this.get('isFetchingConfig')) {
        return;
      }
      this.set('isFetchingConfig', true);
      return this.reload();
    }
  }.property('_config'),

  isPullRequest: function() {
    return this.get('eventType') === 'pull_request' || this.get('pullRequest');
  }.property('eventType'),

  isMatrix: function() {
    return this.get('jobs.length') > 1;
  }.property('jobs.length'),

  isFinished: function() {
    var ref;
    return (ref = this.get('state')) === 'passed' || ref === 'failed' || ref === 'errored' || ref === 'canceled';
  }.property('state'),

  notStarted: function() {
    var ref;
    return (ref = this.get('state')) === 'queued' || ref === 'created' || ref === 'received';
  }.property('state'),

  startedAt: function() {
    if (!this.get('notStarted')) {
      return this.get('_startedAt');
    }
  }.property('_startedAt', 'notStarted'),

  finishedAt: function() {
    if (!this.get('notStarted')) {
      return this.get('_finishedAt');
    }
  }.property('_finishedAt', 'notStarted'),

  requiredJobs: function() {
    return this.get('jobs').filter(function(data) {
      return !data.get('allowFailure');
    });
  }.property('jobs.@each.allowFailure'),

  allowedFailureJobs: function() {
    return this.get('jobs').filter(function(data) {
      return data.get('allowFailure');
    });
  }.property('jobs.@each.allowFailure'),

  rawConfigKeys: function() {
    var keys;
    keys = [];
    this.get('jobs').forEach(function(job) {
      return configKeys(job.get('config')).forEach(function(key) {
        if (!keys.contains(key)) {
          return keys.pushObject(key);
        }
      });
    });
    return keys;
  }.property('config', 'jobs.@each.config'),

  configKeys: function() {
    var headers, keys;
    keys = this.get('rawConfigKeys');
    headers = ['Job', 'Duration', 'Finished'];
    return $.map(headers.concat(keys), function(key) {
      if (configKeysMap.hasOwnProperty(key)) {
        return configKeysMap[key];
      } else {
        return key;
      }
    });
  }.property('rawConfigKeys.length'),

  canCancel: function() {
    return this.get('jobs').filterBy('canCancel', true).length;
  }.property('jobs.@each.canCancel', 'jobs', 'jobs.[]'),

  canRestart: Ember.computed.alias('isFinished'),

  cancel() {
    return this.get('ajax').post("/builds/" + (this.get('id')) + "/cancel");
  },

  restart() {
    return this.get('ajax').post(`/builds/${this.get('id')}/restart`);
  },

  formattedFinishedAt: function() {
    var finishedAt;
    if (finishedAt = this.get('finishedAt')) {
      return moment(finishedAt).format('lll');
    }
  }.property('finishedAt')

});

export default Build;
