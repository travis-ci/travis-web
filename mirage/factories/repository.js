import { Factory } from 'miragejs';

export default Factory.extend({
  name: 'travis-web',
  vcs_name: 'travis-web',
  github_language: 'ruby',
  active: true,
  active_on_org: false,
  email_subscribed: true,
  migration_status: null,
  owner_name: 'travis-ci',
  build_count: 100,
  owner: Object.freeze({
    login: 'travis-ci',
  }),

  permissions: Object.freeze({
    read: false,
    activate: false,
    deactivate: false,
    star: false,
    unstar: false,
    build_cancel: true,
    build_restart: true,
    build_debug: true,
    log_view: true,
    log_delete: true,
    cache_view: true,
    cache_delete: true,
    settings_read: true,
    settings_create: true,
    settings_update: true,
    settings_delete: true,
    create_request: false,
    create_cron: false,
    change_settings: false,
    admin: false,
  }),

  customSshKey: Object.freeze({
    description: 'Custom',
    fingerprint: 'dd:cc:bb:aa',
    type: 'custom',
  }),

  defaultSshKey: Object.freeze({
    type: 'default',
    fingerprint: 'aa:bb:cc:dd',
    description: 'Default',
  }),

  vcsType: 'GithubRepository',

  slug: function () {
    return `${this.owner.login}/${this.name}`;
  },

  afterCreate(repository, server) {
    if (!repository.attrs.skipPermissions) {
      // Creates permissions for first user in the database
      // TODO: I'd like to remove it at some point as this is unexpected
      // we should set up permissions as needed. Possibly whenever we fully
      // switch to permissions from V3
      const user = server.schema.users.all().models[0] || null;
      server.create('permissions', { user, repository });
    }
  },
});
