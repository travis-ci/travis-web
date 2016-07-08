import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  slug: 'travis-ci/travis-web',
  githubLanguage: 'ruby',
  active: true,

  afterCreate(repository, server) {
    if (!repository.attrs.skipPermissions) {
      // Creates permissions for first user in the database
      const user = server.schema.users.all().models[0];

      repository.createPermissions({user});
    }
  }
});
