import ExpandableRecordArray from 'travis/utils/expandable-record-array';
import Model from 'travis/models/model';
import { durationFrom as durationFromHelper } from 'travis/utils/helpers';
import Build from 'travis/models/build';
import Config from 'travis/config/environment';
import Ember from 'ember';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

const { service } = Ember.inject;

var Repo;

if (Config.useV3API) {
  Repo = Model.extend({
    defaultBranch: belongsTo('branch', {
      async: false
    }),
    lastBuild: Ember.computed.oneWay('defaultBranch.lastBuild'),
    lastBuildFinishedAt: Ember.computed.oneWay('lastBuild.finishedAt'),
    lastBuildId: Ember.computed.oneWay('lastBuild.id'),
    lastBuildState: Ember.computed.oneWay('lastBuild.state'),
    lastBuildNumber: Ember.computed.oneWay('lastBuild.number'),
    lastBuildStartedAt: Ember.computed.oneWay('lastBuild.startedAt'),
    lastBuildDuration: Ember.computed.oneWay('lastBuild.duration')
  });
} else {
  Repo = Model.extend({
    lastBuildNumber: attr('number'),
    lastBuildState: attr(),
    lastBuildStartedAt: attr(),
    lastBuildFinishedAt: attr(),
    _lastBuildDuration: attr('number'),
    lastBuildLanguage: attr(),
    lastBuildId: attr('number'),

    lastBuildHash: function() {
      return {
        id: this.get('lastBuildId'),
        number: this.get('lastBuildNumber'),
        repo: this
      };
    }.property('lastBuildId', 'lastBuildNumber'),

    lastBuild: function() {
      var id;
      if (id = this.get('lastBuildId')) {
        this.store.findRecord('build', id);
        return this.store.recordForId('build', id);
      }
    }.property('lastBuildId'),

    lastBuildDuration: function() {
      var duration;
      duration = this.get('_lastBuildDuration');
      if (!duration) {
        duration = durationFromHelper(this.get('lastBuildStartedAt'), this.get('lastBuildFinishedAt'));
      }
      return duration;
    }.property('_lastBuildDuration', 'lastBuildStartedAt', 'lastBuildFinishedAt'),

    isFinished: function() {
      let state = this.get('lastBuildState');
      return ['passed', 'failed', 'errored', 'canceled'].contains(state);
    }.property('lastBuildState')
  });
}

Repo.reopen({
  ajax: service(),
  slug: attr(),
  description: attr(),
  "private": attr('boolean'),
  githubLanguage: attr(),
  active: attr(),

  withLastBuild() {
    return this.filter(function(repo) {
      return repo.get('lastBuildId');
    });
  },

  sshKey: function() {
    this.store.find('ssh_key', this.get('id'));
    return this.store.recordForId('ssh_key', this.get('id'));
  },

  envVars: function() {
    var id;
    id = this.get('id');
    return this.store.filter('env_var', {
      repository_id: id
    }, function(v) {
      return v.get('repo.id') === id;
    });
  }.property(),

  builds: function() {
    var array, builds, id;
    id = this.get('id');
    builds = this.store.filter('build', {
      event_type: ['push', 'api', 'cron'],
      repository_id: id
    }, function(b) {
      return b.get('repo.id') + '' === id + '' && (b.get('eventType') === 'push' || b.get('eventType') === 'api' || b.get('eventType') === 'cron');
    });
    array = ExpandableRecordArray.create({
      type: 'build',
      content: Ember.A([])
    });
    array.load(builds);
    array.observe(builds);
    return array;
  }.property(),

  pullRequests: function() {
    var array, builds, id;
    id = this.get('id');
    builds = this.store.filter('build', {
      event_type: 'pull_request',
      repository_id: id
    }, function(b) {
      return b.get('repo.id') + '' === id + '' && b.get('eventType') === 'pull_request';
    });
    array = ExpandableRecordArray.create({
      type: 'build',
      content: Ember.A([])
    });
    array.load(builds);
    id = this.get('id');
    array.observe(builds);
    return array;
  }.property(),

  crons: function() {
    var array, builds, id;
    id = this.get('id');
    builds = this.store.filter('build', {
      event_type: 'cron',
      repository_id: id
    }, function(b) {
      return b.get('repo.id') + '' === id + '' && b.get('eventType') === 'cron';
    });
    array = ExpandableRecordArray.create({
      type: 'build',
      content: Ember.A([])
    });
    array.load(builds);
    id = this.get('id');
    array.observe(builds);
    return array;
  }.property(),

  branches: function() {
    var id = this.get('id');
    return this.store.filter('branch', {
      repository_id: id
    }, function(b) {
      return b.get('repoId') === id;
    });
  }.property(),

  cronJobs: function() {
    var id = this.get('id');
    return this.store.filter('cron', {
      repository_id: id
    }, function(cron) {
      return cron.get('branch.repoId') === id;
    });
  }.property(),

  owner: function() {
    return (this.get('slug') || '').split('/')[0];
  }.property('slug'),

  name: function() {
    return (this.get('slug') || '').split('/')[1];
  }.property('slug'),

  sortOrderForLandingPage: function() {
    var state;
    state = this.get('lastBuildState');
    if (state !== 'passed' && state !== 'failed') {
      return 0;
    } else {
      return parseInt(this.get('lastBuildId'));
    }
  }.property('lastBuildId', 'lastBuildState'),

  stats: function() {
    if (this.get('slug')) {
      return this.get('_stats') || $.get("https://api.github.com/repos/" + this.get('slug'), (data) => {
        this.set('_stats', data);
        return this.notifyPropertyChange('stats');
      }) && {};
    }
  }.property('slug'),

  updateTimes() {
    var lastBuild;
    if (Config.useV3API) {
      if (lastBuild = this.get('lastBuild')) {
        return lastBuild.updateTimes();
      }
    } else {
      return this.notifyPropertyChange('lastBuildDuration');
    }
  },

  regenerateKey(options) {
    return this.get('ajax').ajax('/repos/' + this.get('id') + '/key', 'post', options);
  },

  fetchSettings() {
    return this.get('ajax').ajax('/repos/' + this.get('id') + '/settings', 'get', {
      forceAuth: true
    }).then(function(data) {
      return data['settings'];
    });
  },

  saveSettings(settings) {
    return this.get('ajax').ajax('/repos/' + this.get('id') + '/settings', 'patch', {
      data: {
        settings: settings
      }
    });
  }
});

Repo.reopenClass({
  recent() {
    return this.find();
  },

  accessibleBy(store, reposIdsOrlogin) {
    var login, promise, repos, reposIds;
    if (Config.useV3API) {
      reposIds = reposIdsOrlogin;
      repos = store.filter('repo', function(repo) {
        return reposIds.indexOf(parseInt(repo.get('id'))) !== -1;
      });
      promise = new Ember.RSVP.Promise(function(resolve, reject) {
        return store.query('repo', {
          'repository.active': 'true',
          sort_by: 'default_branch.last_build:desc',
          limit: 30
        }).then(function() {
          return resolve(repos);
        }, function() {
          return reject();
        });
      });
      return promise;
    } else {
      login = reposIdsOrlogin;
      return store.query('repo', {
        member: login,
        orderBy: 'name'
      });
    }
  },

  search(store, ajax, query) {
    var promise, queryString, result;
    if (Config.useV3API) {
      queryString = $.param({
        search: query,
        orderBy: 'name',
        limit: 5
      });
      promise = ajax.ajax("/repos?" + queryString, 'get');
      result = Ember.ArrayProxy.create({
        content: []
      });
      return promise.then(function(data, status, xhr) {
        var promises;
        promises = data.repos.map(function(repoData) {
          return store.findRecord('repo', repoData.id).then(function(record) {
            result.pushObject(record);
            result.set('isLoaded', true);
            return record;
          });
        });
        return Ember.RSVP.allSettled(promises).then(function() {
          return result;
        });
      });
    } else {
      return store.query('repo', {
        search: query,
        orderBy: 'name'
      });
    }
  },

  withLastBuild(store) {
    var repos;
    repos = store.filter('repo', {}, function(build) {
      return build.get('lastBuildId');
    });
    repos.then(function() {
      return repos.set('isLoaded', true);
    });
    return repos;
  },

  fetchBySlug(store, slug) {
    var adapter, modelClass, promise, repos;
    repos = store.peekAll('repo').filterBy('slug', slug);
    if (repos.get('length') > 0) {
      return repos.get('firstObject');
    } else {
      promise = null;
      if (Config.useV3API) {
        adapter = store.adapterFor('repo');
        modelClass = store.modelFor('repo');
        promise = adapter.findRecord(store, modelClass, slug).then(function(payload) {
          var i, len, r, record, ref, repo, result, serializer;
          serializer = store.serializerFor('repo');
          modelClass = store.modelFor('repo');
          result = serializer.normalizeResponse(store, modelClass, payload, null, 'findRecord');
          repo = store.push({
            data: result.data
          });
          ref = result.included;
          for (i = 0, len = ref.length; i < len; i++) {
            record = ref[i];
            r = store.push({
              data: record
            });
          }
          return repo;
        });
      } else {
        promise = store.query('repo', {
          slug: slug
        }).then(function(repos) {
          return repos.get('firstObject') || (function() {
            throw "no repos found";
          })();
        });
      }
      return promise["catch"](function() {
        var error;
        error = new Error('repo not found');
        error.slug = slug;
        throw error;
      });
    }
  }
});

export default Repo;
