import ArrayProxy from '@ember/array/proxy';
import {
  Promise as EmberPromise,
  allSettled
} from 'rsvp';
import $ from 'jquery';
import { A } from '@ember/array';
import ExpandableRecordArray from 'travis/utils/expandable-record-array';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { oneWay } from 'ember-decorators/object/computed';

const Repo = Model.extend({
  @service api: null,
  @service auth: null,
  permissions: attr(),
  slug: attr(),
  description: attr(),
  'private': attr('boolean'),
  githubLanguage: attr(),
  active: attr(),
  owner: attr(),
  name: attr(),
  starred: attr('boolean'),

  @oneWay('owner.@type') ownerType: null,

  @oneWay('currentBuild.finishedAt') currentBuildFinishedAt: null,
  @oneWay('currentBuild.state') currentBuildState: null,
  @oneWay('currentBuild.id') currentBuildId: null,

  defaultBranch: belongsTo('branch', {
    async: false
  }),
  currentBuild: belongsTo('build', {
    async: true, inverse: 'repoCurrentBuild'
  }),

  // TODO: this is a hack, we should remove it once @is_collaborator property is
  // added to a response with the repo
  @computed('auth.currentUser.permissions.[]')
  isCurrentUserACollaborator(permissions) {
    if (permissions) {
      let id = parseInt(this.get('id'));

      return permissions.includes(id);
    }
  },

  sshKey: function () {
    this.store.find('ssh_key', this.get('id'));
    return this.store.recordForId('ssh_key', this.get('id'));
  },

  @computed('id')
  envVars(id) {
    return this.store.filter('env_var', {
      repository_id: id
    }, (v) => v.get('repo.id') === id);
  },

  _buildRepoMatches(build, id) {
    // TODO: I don't understand why we need to compare string id's here
    return `${build.get('repo.id')}` === `${id}`;
  },

  _buildObservableArray(builds) {
    const array = ExpandableRecordArray.create({
      type: 'build',
      content: A([])
    });
    array.load(builds);
    array.observe(builds);
    return array;
  },

  @computed('id')
  builds(id) {
    const builds = this.store.filter('build', {
      event_type: ['push', 'api', 'cron'],
      repository_id: id
    }, (b) => {
      let eventTypes = ['push', 'api', 'cron'];
      return this._buildRepoMatches(b, id) && eventTypes.includes(b.get('eventType'));
    });
    return this._buildObservableArray(builds);
  },

  @computed('id')
  pullRequests(id) {
    const builds = this.store.filter('build', {
      event_type: 'pull_request',
      repository_id: id
    }, (b) => {
      const isPullRequest = b.get('eventType') === 'pull_request';
      return this._buildRepoMatches(b, id) && isPullRequest;
    });
    return this._buildObservableArray(builds);
  },

  @computed('id')
  branches(id) {
    return this.store.filter('branch', {
      repository_id: id
    }, (b) => b.get('repoId') === id);
  },

  @computed('id')
  cronJobs(id) {
    return this.store.filter('cron', {
      repository_id: id
    }, (cron) => cron.get('branch.repoId') === id);
  },

  // TODO: Stop performing a `set` as part of the cp!
  // TODO: Is this even used?
  @computed('slug', '_stats')
  stats(slug, stats) {
    if (slug) {
      return stats || $.get(`https://api.github.com/repos/${slug}`, (data) => {
        this.set('_stats', data);
        return this.notifyPropertyChange('stats');
      }) && {};
    }
  },

  updateTimes() {
    let currentBuild = this.get('currentBuild');
    if (currentBuild) {
      return currentBuild.updateTimes();
    }
  },

  fetchSettings() {
    const url = `/repo/${this.get('id')}/settings`;
    return this.get('api').request(url, 'get').
      then(data => this._convertV3SettingsToV2(data['settings']));
  },

  saveSetting(name, value) {
    return this.get('api').patch(`/repo/${this.get('id')}/setting/${name}`, {
      data: {
        'setting.value': value
      }
    });
  },

  _convertV3SettingsToV2(v3Settings) {
    return v3Settings.reduce((v2Settings, v3Setting) => {
      if (v3Setting) {
        v2Settings[v3Setting.name] = v3Setting.value;
      }
      return v2Settings;
    }, {});
  },

  toggle() {
    const adapter = this.store.adapterFor('repo');
    const id = this.get('id');
    let promise;
    if (this.get('active')) {
      promise = adapter.deactivate(id);
    } else {
      promise = adapter.activate(id);
    }

    return promise;
  },
});

Repo.reopenClass({
  recent() {
    return this.find();
  },

  accessibleBy(store, reposIdsOrlogin) {
    let repos, reposIds;
    reposIds = reposIdsOrlogin;
    repos = store.filter('repo', (repo) => {
      let repoId = parseInt(repo.get('id'));
      return reposIds.includes(repoId);
    });
    return new EmberPromise((resolve, reject) => {
      const params = {
        'repository.active': 'true',
        sort_by: 'current_build:desc',
        limit: 30,
      };
      return store.query('repo', params)
        .then(() => resolve(repos), () => reject());
    });
  },

  search(store, query) {
    let promise, queryString, result;
    return store.query('repo', {
      slug_filter: query,
      sort_by: 'slug_filter:desc',
      limit: 10
    });
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
      promise = adapter.findRecord(store, modelClass, slug).then((payload) => {
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
  },
});

export default Repo;
