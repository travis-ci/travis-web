import { durationFrom, configKeys, compact } from 'travis/utils/helpers';
import configKeysMap from 'travis/utils/keys-map';
import Ember from 'ember';
import Model from 'travis/models/model';
import Log from 'travis/models/log';
import DurationCalculations from 'travis/mixins/duration-calculations';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

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

  log: function() {
    this.set('isLogAccessed', true);
    return Log.create({
      job: this,
      ajax: this.get('ajax')
    });
  }.property(),

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

  repoSlug: function() {
    return this.get('repositorySlug');
  }.property('repositorySlug'),

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

  isFinished: function() {
    var ref;
    return (ref = this.get('state')) === 'passed' || ref === 'failed' || ref === 'errored' || ref === 'canceled';
  }.property('state'),

  notStarted: function() {
    var ref;
    return (ref = this.get('state')) === 'queued' || ref === 'created' || ref === 'received';
  }.property('state'),

  clearLog() {
    if (this.get('isLogAccessed')) {
      return this.get('log').clear();
    }
  },

  sponsor: function() {
    return {
      name: "Blue Box",
      url: "http://bluebox.net"
    };
  }.property(),

  configValues: function() {
    var config, keys;
    config = this.get('config');
    keys = this.get('build.rawConfigKeys');
    if (config && keys) {
      return keys.map(function(key) {
        return config[key];
      });
    } else {
      return [];
    }
  }.property('config', 'build.rawConfigKeys.length'),

  canCancel: function() {
    return !this.get('isFinished');
  }.property('isFinished'),

  canRestart: Ember.computed.alias('isFinished'),

  cancel() {
    return this.get('ajax').post("/jobs/" + (this.get('id')) + "/cancel");
  },

  removeLog() {
    return this.get('ajax').patch("/jobs/" + (this.get('id')) + "/log").then(() => {
      return this.reloadLog();
    });
  },

  reloadLog() {
    this.clearLog();
    return this.get('log').fetch();
  },

  restart() {
    return this.get('ajax').post("/jobs/" + (this.get('id')) + "/restart");
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
      return Travis.pusher.subscribe("job-" + (this.get('id')));
    }
  },

  unsubscribe() {
    if (!this.get('subscribed')) {
      return;
    }
    this.set('subscribed', false);
    if (Travis.pusher) {
      return Travis.pusher.unsubscribe("job-" + (this.get('id')));
    }
  },

  onStateChange: function() {
    if (this.get('state') === 'finished' && Travis.pusher) {
      return this.unsubscribe();
    }
  }.observes('state'),

  formattedFinishedAt: function() {
    var finishedAt;
    if (finishedAt = this.get('finishedAt')) {
      return moment(finishedAt).format('lll');
    }
  }.property('finishedAt'),

  canRemoveLog: function() {
    return !this.get('log.removed');
  }.property('log.removed'),

  slug: function() {
    return (this.get('repo.slug')) + " #" + (this.get('number'));
  } .property(),

  isLegacyInfrastructure: function() {
    if (this.get('queue') === 'builds.linux') {
      return true;
    }
  }.property('queue'),

  displayGceNotice: function() {
    if (this.get('queue') === 'builds.gce' && this.get('config.dist') === 'precise') {
      return true;
    } else {
      return false;
    }
  }.property('queue', 'config.dist')
});
