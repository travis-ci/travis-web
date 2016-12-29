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

  afterCreate(repository, server) {
    if (!repository.attrs.skipPermissions) {
      // Creates permissions for first user in the database
      const user = server.schema.users.all().models[0];
      server.create('permissions', { user, repository });
    }
  }
});
