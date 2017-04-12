import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  slug: 'travis-ci/travis-web',
  githubLanguage: 'ruby',
  active: true,
  owner: {
    login: 'travis-ci',
  },
  permissions: {
    read: false,
    activate: false,
    deactivate: false,
    star: false,
    unstar: false,
    create_request: false,
    create_cron: false,
    change_settings: false,
    admin: false,
  },

  customSshKey: {
    description: 'Custom',
    fingerprint: 'dd:cc:bb:aa',
    type: 'custom'
  },

  defaultSshKey: {
    type: 'default',
    fingerprint: 'aa:bb:cc:dd',
    description: 'Default',
  },

  afterCreate(repository, server) {
    if (!repository.attrs.skipPermissions) {
      // Creates permissions for first user in the database
      const user = server.schema.users.all().models[0];
      server.create('permissions', { user, repository });
    }
  }
});
