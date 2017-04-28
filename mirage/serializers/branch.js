import V3Serializer from './v3';

export default V3Serializer.extend({
  serializeSingle(branch) {
    const builds = branch.builds;

    if (!branch.lastBuild && builds && builds.models.length) {
      branch.lastBuild = builds.models[builds.models.length - 1];
    }

    return V3Serializer.prototype.serializeSingle.apply(this, arguments);
  },

  hrefForSingle(type, model, request) {
    // TODO: do we need to try request? it seems like branch should always
    // belong to a repository
    let repositoryId = request.params.repository_id ||
      request.params.repo_id ||
      (model.repository && model.repository.id);

    return `/repo/${repositoryId}/branch/${model.attrs.name}`;
  },

  hrefForCollection(type, collection, request) {
    let repositoryId = request.params.repository_id ||
                       (collection.models.length && collection.models[0].repository.id);

    return `/repo/${repositoryId}/branches`;
  },

  normalizeId() {
    // branches don't have id in our API
    return null;
  }
});
