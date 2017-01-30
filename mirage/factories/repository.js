import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  slug: 'travis-ci/travis-web',
  githubLanguage: 'ruby',
  active: true,
  permissions: {
    read: false,
    enable: false,
    disable: false,
    star: false,
    unstar: false,
    create_request: false,
    create_cron: false,
    change_settings: false,
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
