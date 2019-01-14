import V3Serializer from './v3';

export default V3Serializer.extend({
  serializeSingle(repository) {
    this.fixOwnerAndName(repository);

    if (!repository.defaultBranch && repository.branches) {
      let defaultBranch = repository.branches.models.find(branch => branch.default_branch);
      repository.defaultBranch = defaultBranch;
    }

    if (!repository.currentBuild) {
      let builds = repository._schema.builds.where((build) => {
        let repoId = repository.id;
        return build.repository_id === repoId || build.repositoryId == repoId;
      });

      if (builds.length) {
        repository.currentBuild = builds.models[0];
      }
    }

    return V3Serializer.prototype.serializeSingle.apply(this, arguments);
  },

  // In most tests we just set slug for the repo. This ensures that we return
  // also name and owner data to make the payload more similar to what we get in
  // production.
  fixOwnerAndName(repository) {
    let owner, name,
      attrs = repository.attrs;

    if (attrs.slug) {
      [owner, name] = attrs.slug.split('/');
    }

    attrs.owner = attrs.owner || {};

    if (owner && !attrs.owner.login) {
      attrs.owner.login = owner;
    }

    if (name && !attrs.name) {
      attrs.name = name;
    }
  }
});
