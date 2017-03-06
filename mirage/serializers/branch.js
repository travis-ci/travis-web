import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(object, request) {
    if (object.attrs) {
      return this.serializeSingle(object, request);
    }
    return {
      '@type': 'branches',
      '@href': `/repo/${request.params.repository_id}/branches`,
      '@representation': 'standard',
      '@pagination': {
        count: object.length
      },
      branches: object.models.map(branch => this.serializeSingle(branch, request)),
    };
  },

  serializeSingle(branch, request) {
    let repositoryId = request.params.repository_id ||
      request.params.repo_id ||
      (branch.repository && branch.repository.id);

    let {
      name,
      default_branch,
      exists_on_github
    } = branch.attrs;

    let response = {
      '@type': 'branch',
      '@href': `/repo/${repositoryId}/branch/${name}`,
      '@representation': 'standard',
      name,
      default_branch,
      exists_on_github,
    };

    const { builds } = branch;

    const { include } = request.queryParams;

    // avoid circular references between builds/branches
    if (include && !include.includes('build.branch')) {
      if (builds && builds.models.length) {
        const lastBuild = builds.models[builds.models.length - 1];

        response.last_build = this.serializerFor('build').serializeEmbedded(lastBuild, request);
      }
    }

    if (branch.repository) {
      const repositorySerializer = this.serializerFor('repository');
      response.repository = repositorySerializer.serializeEmbedded(branch.repository, request);
    }

    return response;
  },
});
