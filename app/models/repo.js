import ExpandableRecordArray from 'travis/utils/expandable-record-array';
import Model from 'ember-data/model';
import Ember from 'ember';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

const { service } = Ember.inject;

const Repo = Model.extend({
  ajax: service(),
  slug: attr(),
  description: attr(),
  'private': attr('boolean'),
  githubLanguage: attr(),
  active: attr(),

  defaultBranch: belongsTo('branch', {
    async: false
  }),
  currentBuild: belongsTo('build', {
    async: true, inverse: 'repoCurrentBuild'
  }),
  currentBuildFinishedAt: Ember.computed.oneWay('currentBuild.finishedAt'),
  currentBuildId: Ember.computed.oneWay('currentBuild.id'),

  withLastBuild() {
    return this.filter(repo => repo.get('lastBuildId'));
  },

  sshKey() {
    this.store.find('ssh_key', this.get('id'));
    return this.store.recordForId('ssh_key', this.get('id'));
  },

  envVars: Ember.computed(function () {
    let id;
    id = this.get('id');
    return this.store.filter('env_var', {
      repository_id: id
    }, v => v.get('repo.id') === id);
  }),

  builds: Ember.computed(function () {
    let array, builds, id;
    id = this.get('id');
    builds = this.store.filter('build', {
      event_type: ['push', 'api', 'cron'],
      repository_id: id
    }, b => {
      let eventTypes = ['push', 'api', 'cron'];
      return `${b.get('repo.id')}` === `${id}` && eventTypes.contains(b.get('eventType'));
    });
    array = ExpandableRecordArray.create({
      type: 'build',
      content: Ember.A([])
    });
    array.load(builds);
    array.observe(builds);
    return array;
  }),

  pullRequests: Ember.computed(function () {
    let array, builds, id;
    id = this.get('id');
    builds = this.store.filter('build', {
      event_type: 'pull_request',
      repository_id: id
    }, b => `${b.get('repo.id')}` === `${id}` && b.get('eventType') === 'pull_request');
    array = ExpandableRecordArray.create({
      type: 'build',
      content: Ember.A([])
    });
    array.load(builds);
    id = this.get('id');
    array.observe(builds);
    return array;
  }),

  crons: Ember.computed(function () {
    let array, builds, id;
    id = this.get('id');
    builds = this.store.filter('build', {
      event_type: 'cron',
      repository_id: id
    }, b => `${b.get('repo.id')}` === `${id}` && b.get('eventType') === 'cron');
    array = ExpandableRecordArray.create({
      type: 'build',
      content: Ember.A([])
    });
    array.load(builds);
    id = this.get('id');
    array.observe(builds);
    return array;
  }),

  branches: Ember.computed(function () {
    const id = this.get('id');
    return this.store.filter('branch', {
      repository_id: id
    }, b => b.get('repoId') === id);
  }),

  cronJobs: Ember.computed(function () {
    const id = this.get('id');
    return this.store.filter('cron', {
      repository_id: id
    }, cron => cron.get('branch.repoId') === id);
  }),

  owner: Ember.computed('slug', function () {
    return (this.get('slug') || '').split('/')[0];
  }),

  name: Ember.computed('slug', function () {
    return (this.get('slug') || '').split('/')[1];
  }),

  stats: Ember.computed('slug', function () {
    if (this.get('slug')) {
      return this.get('_stats') || Ember.$.get(`https://api.github.com/repos/${this.get('slug')}`, (data) => {
        this.set('_stats', data);
        return this.notifyPropertyChange('stats');
      }) && {};
    }
  }),

  updateTimes() {
    let currentBuild = this.get('currentBuild');
    if (currentBuild) {
      return currentBuild.updateTimes();
    }
  },

  regenerateKey(options) {
    return this.get('ajax').ajax(`/repos/${this.get('id')}/key`, 'post', options);
  },

  fetchSettings() {
    return this.get('ajax').ajax(`/repos/${this.get('id')}/settings`, 'get', {
      forceAuth: true
    }).then(data => data['settings']);
  },

  saveSettings(settings) {
    return this.get('ajax').ajax(`/repos/${this.get('id')}/settings`, 'patch', {
      data: {
        settings
      }
    });
  }
});

Repo.reopenClass({
  recent() {
    return this.find();
  },

  accessibleBy(store, reposIdsOrlogin) {
    let promise, repos, reposIds;
    reposIds = reposIdsOrlogin;
    repos = store.filter('repo', repo => {
      let repoId = parseInt(repo.get('id'));
      return reposIds.contains(repoId);
    });
    promise = new Ember.RSVP.Promise((resolve, reject) => store.query('repo', {
      'repository.active': 'true',
      sort_by: 'current_build:desc',
      limit: 30
    }).then(() => resolve(repos), () => reject()));
    return promise;
  },

  search(store, ajax, query) {
    let promise, queryString, result;
    queryString = Ember.$.param({
      search: query,
      orderBy: 'name',
      limit: 5
    });
    promise = ajax.ajax(`/repos?${queryString}`, 'get');
    result = Ember.ArrayProxy.create({
      content: []
    });
    return promise.then(data => {
      let promises = data.repos.map(repoData => {
        store.findRecord('repo', repoData.id).then(record => {
          result.pushObject(record);
          result.set('isLoaded', true);
          return record;
        });
      });
      return Ember.RSVP.allSettled(promises).then(() => result);
    });
  },

  withLastBuild(store) {
    let repos;
    repos = store.filter('repo', {}, build => build.get('lastBuildId'));
    repos.then(() => repos.set('isLoaded', true));
    return repos;
  },

  fetchBySlug(store, slug) {
    let adapter, modelClass, promise, repos;
    repos = store.peekAll('repo').filterBy('slug', slug);
    if (repos.get('length') > 0) {
      return repos.get('firstObject');
    } else {
      promise = null;
      adapter = store.adapterFor('repo');
      modelClass = store.modelFor('repo');
      promise = adapter.findRecord(store, modelClass, slug).then(payload => {
        let i, len, record, ref, repo, result, serializer;
        serializer = store.serializerFor('repo');
        modelClass = store.modelFor('repo');
        result = serializer.normalizeResponse(store, modelClass, payload, null, 'findRecord');
        repo = store.push({
          data: result.data
        });
        ref = result.included;
        for (i = 0, len = ref.length; i < len; i++) {
          record = ref[i];
          store.push({
            data: record
          });
        }
        return repo;
      });
      return promise['catch'](() => {
        let error;
        error = new Error('repo not found');
        error.slug = slug;
        throw error;
      });
    }
  }
});

export default Repo;
