import V3Serializer from './v3';

export default V3Serializer.extend({
  serializeSingle(repository) {
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
  }
});
