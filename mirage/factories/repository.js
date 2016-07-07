import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  slug: 'travis-ci/travis-web',
  githubLanguage: 'ruby',
  active: true,

  afterCreate(repository, server) {
    const repoId = parseInt(repository.id);

    server.create('permissions', {
      admin: [repoId],
      push: [repoId],
      pull: [repoId],
      permissions: [repoId],
    });
  }
});
