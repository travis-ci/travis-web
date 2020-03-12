import VcsEntity from 'travis/models/vcs-entity';
import { attr, hasMany, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, equal, or } from '@ember/object/computed';
import { Promise as EmberPromise, } from 'rsvp';
import { task } from 'ember-concurrency';
import ExpandableRecordArray from 'travis/utils/expandable-record-array';
import { defaultVcsConfig } from 'travis/utils/vcs';
import { isEmpty } from '@ember/utils';

export const MIGRATION_STATUS = {
  QUEUED: 'queued',
  MIGRATING: 'migrating',
  MIGRATED: 'migrated',
  SUCCESS: 'success',
  FAILURE: 'failure'
};

export const HISTORY_MIGRATION_STATUS = {
  MIGRATED: 'migrated'
};

const Repo = VcsEntity.extend({
  api: service(),
  auth: service(),

  permissions: attr(),
  slug: attr('string'),
  description: attr('string'),
  'private': attr('boolean'),
  githubId: attr(),
  githubLanguage: attr(),
  active: attr(),
  owner: attr(),
  ownerName: attr('string'), // owner_name of repository normalized by provider
  name: attr('string'),
  vcsName: attr('string'), // name of repository normalized by provider
  starred: attr('boolean'),
  active_on_org: attr('boolean'),
  emailSubscribed: attr('boolean'),
  migrationStatus: attr('string'),
  historyMigrationStatus: attr('string'),

  ownerType: reads('owner.@type'),

  currentBuildFinishedAt: reads('currentBuild.finishedAt'),
  currentBuildState: reads('currentBuild.state'),
  currentBuildId: reads('currentBuild.id'),

  isMigrationQueued: equal('migrationStatus', MIGRATION_STATUS.QUEUED),
  isMigrationMigrating: equal('migrationStatus', MIGRATION_STATUS.MIGRATING),
  isMigrationMigrated: equal('migrationStatus', MIGRATION_STATUS.MIGRATED),
  isMigrationSucceeded: equal('migrationStatus', MIGRATION_STATUS.SUCCESS),
  isMigrationFailed: equal('migrationStatus', MIGRATION_STATUS.FAILURE),
  isMigrationInProgress: or('isMigrationQueued', 'isMigrationMigrating'),

  isMigrated: or('isMigrationSucceeded', 'isMigrationMigrated'),

  isHistoryMigrated: equal('historyMigrationStatus', HISTORY_MIGRATION_STATUS.MIGRATED),

  isMigratable: computed('migrationStatus', 'permissions.migrate', function () {
    const isMigrated = !!this.migrationStatus;
    const isFailed = this.isMigrationFailed;
    const hasPermissions = this.permissions.migrate;
    return hasPermissions && (!isMigrated || isFailed);
  }),

  defaultBranch: belongsTo('branch', { async: false }),
  currentBuild: belongsTo('build', { async: true, inverse: 'repoCurrentBuild' }),

  _branches: hasMany('branch'),

  isCurrentUserACollaborator: computed('auth.currentUser.permissions.[]', function () {
    let permissions = this.get('auth.currentUser.permissions');

    if (permissions) {
      let id = parseInt(this.id);

      return permissions.includes(id);
    }
  }),

  formattedSlug: computed('owner.login', 'name', function () {
    let login = this.get('owner.login');
    let name = this.name;
    return `${login} / ${name}`;
  }),

  sshKey: function () {
    this.store.find('ssh_key', this.id);
    return this.store.recordForId('ssh_key', this.id);
  },

  envVars: computed('id', function () {
    let id = this.id;
    return this.store.filter('env_var', {
      repository_id: id
    }, (v) => v.get('repo.id') === id);
  }),

  settings: computed('id', 'fetchSettings.lastSuccessful.value', function () {
    const { value } = this.fetchSettings.lastSuccessful || {};
    if (!value) this.fetchSettings.perform();
    return value;
  }),

  fetchSettings: task(function* () {
    if (!this.auth.signedIn) return {};
    try {
      const response = yield this.api.get(`/repo/${this.id}/settings`);
      return this._convertV3SettingsToV2(response.settings);
    } catch (error) {}
  }).drop(),

  _buildRepoMatches(build, id) {
    // TODO: I don't understand why we need to compare string id's here
    return `${build.get('repo.id')}` === `${id}`;
  },

  _buildObservableArray(builds) {
    const array = ExpandableRecordArray.create({
      type: 'build',
      content: []
    });
    array.load(builds);
    array.observe(builds);
    return array;
  },

  builds: computed('id', function () {
    let id = this.id;
    const builds = this.store.filter('build', {
      event_type: ['push', 'api', 'cron'],
      repository_id: id,
    }, (b) => {
      let eventTypes = ['push', 'api', 'cron'];
      return this._buildRepoMatches(b, id) && eventTypes.includes(b.get('eventType'));
    });
    return this._buildObservableArray(builds);
  }),

  branches: computed('id', function () {
    let id = this.id;
    return this.store.filter('branch', {
      repository_id: id
    }, (b) => b.get('repoId') === id);
  }),

  cronJobs: computed('id', 'fetchCronJobs.lastSuccessful.value', function () {
    const crons = this.fetchCronJobs.get('lastSuccessful.value');
    if (!crons) {
      this.get('fetchCronJobs').perform();
    }
    return crons || [];
  }),

  fetchCronJobs: task(function* () {
    const id = this.id;
    if (id) {
      const crons = yield this.store.filter('cron', { repository_id: id }, (cron) => cron.get('branch.repoId') === id, [''], false);
      return crons;
    }
  }).drop(),

  updateTimes() {
    let currentBuild = this.currentBuild;
    if (currentBuild) {
      return currentBuild.updateTimes();
    }
  },

  startMigration() {
    const url = `/repo/${this.id}/migrate`;
    return this.api.post(url).then(() => {
      this.set('migrationStatus', 'queued');
    });
  },

  saveSetting(name, value) {
    return this.api.patch(`/repo/${this.id}/setting/${name}`, {
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
    const id = this.id;
    let promise;
    if (this.active) {
      promise = adapter.deactivate(id);
    } else {
      promise = adapter.activate(id);
    }

    return promise;
  },

  emailSubscriptionUrl: computed('id', function () {
    let id = this.id;
    return `/repo/${id}/email_subscription`;
  }),

  subscribe: task(function* () {
    yield this.api.post(this.emailSubscriptionUrl);
    yield this.reload();
  }).drop(),

  unsubscribe: task(function* () {
    yield this.api.delete(this.emailSubscriptionUrl);
    yield this.reload();
  }).drop()
});

Repo.reopenClass({
  recent() {
    return this.find();
  },

  accessibleBy(store, reposIdsOrlogin) {
    let repos, reposIds;
    reposIds = reposIdsOrlogin || [];
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
    return store.query('repo', {
      name_filter: query,
      sort_by: 'name_filter:desc',
      limit: 10
    });
  },

  fetchBySlug(store, slug, provider = defaultVcsConfig.urlPrefix) {
    const loadedRepos = store.peekAll('repo').filterBy('provider', provider).filterBy('slug', slug);
    if (!isEmpty(loadedRepos)) {
      return EmberPromise.resolve(loadedRepos.firstObject);
    }
    return store.queryRecord('repo', { slug, provider });
  },
});

export default Repo;
