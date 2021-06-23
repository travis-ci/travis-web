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
  features: service(),
  store: service(),

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
  shared: attr('boolean'),
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

  allowance: computed('owner.allowance', 'repoOwnerAllowance', function () {
    if (this.owner.allowance)
      return this.owner.allowance;
    if (this.repoOwnerAllowance)
      return this.repoOwnerAllowance;
  }),

  repoOwnerAllowance: reads('fetchRepoOwnerAllowance.lastSuccessful.value'),

  fetchRepoOwnerAllowance: task(function* () {
    const allowance = this.store.peekRecord('allowance', this.owner.id);
    if (allowance)
      return allowance;
    return yield this.store.queryRecord('allowance', { login: this.owner.login, provider: this.provider });
  }).drop(),

  buildPermissions: reads('fetchBuildPermissions.lastSuccessful.value'),

  fetchBuildPermissions: task(function* () {
    const url = `/v3/repo/${this.id}/build_permissions`;
    const result = yield this.api.get(url);
    if (result && result.build_permissions) {
      return result.build_permissions.map((perm) => {
        perm.user.provider = perm.user.vcs_type.toLowerCase().replace('user', '');
        if (!perm.user.name) {
          perm.user.name = perm.user.login;
        }
        return perm;
      });
    }
    return [];
  }).keepLatest(),

  changePermissions: task(function* (userIds, permission) {
    const usersArray = Array.isArray(userIds) ? userIds : [userIds];
    const url = `/v3/repo/${this.id}/build_permissions`;
    const data = {
      user_ids: usersArray,
      permission: permission
    };
    yield this.api.patch(url, { data: data });
  }).drop(),

  canOwnerBuild: computed('auth.currentUser.confirmedAt', 'allowance', 'private', 'features.{proVersion,enterpriseVersion}', function () {
    if (this.auth.currentUser && !this.auth.currentUser.confirmedAt)
      return false;
    const isPro = this.get('features.proVersion');
    const enterprise = !!this.get('features.enterpriseVersion');
    const roMode = this.get('owner').ro_mode || false;

    if (!isPro || enterprise) {
      return !roMode;
    }

    const allowance = this.allowance;
    const isPrivate = this.private;

    if (allowance && allowance.subscriptionType === 1)
      return !roMode;
    if (!allowance && !this.repoOwnerAllowance) {
      return !roMode;
    }
    if (!allowance) {
      return false;
    }

    const buildCredits = isPrivate ? allowance.privateRepos : allowance.publicRepos;

    return buildCredits && allowance.userUsage && !roMode;
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

  // slug built from normalized (by provider) owner and repo name
  vcsSlug: computed('ownerName', 'vcsName', function () {
    return `${this.ownerName}/${this.vcsName}`;
  }),

  urlName: computed('slug', function () {
    const { slug = '', vcsName } = this;
    return slug.split('/').lastObject || vcsName;
  }),

  urlOwnerName: computed('slug', function () {
    const { slug = '', ownerName } = this;
    return slug.split('/').firstObject || ownerName;
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
  }).drop(),

  buildBackups: reads('fetchBuildBackups.lastSuccessful.value'),
  buildBackupsLast: false,

  hasBuildBackups: reads('fetchInitialBuildBackups.lastSuccessful.value'),

  fetchInitialBuildBackups: task(function* () {
    const url = `/v3/build_backups?repository_id=${this.id}&offset=0&limit=1`;
    const result = yield this.api.get(url);

    return result && result.build_backups.length > 0;
  }).keepLatest(),

  fetchBuildBackups: task(function* () {
    const url = `/v3/build_backups?repository_id=${this.id}&offset=${this.buildBackups ? this.buildBackups.length : 0}`;
    const result = yield this.api.get(url);
    if (result && result['@pagination']) {
      this.set('buildBackupsLast', result['@pagination'].is_last);
    }
    const oldBackups = this.buildBackups || [];

    return result ? oldBackups.concat(result.build_backups) : [];
  }).keepLatest(),
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
