import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(object, request) {
    return {
      '@type': 'branches',
      branches: object.models.map(branch => {
        const builds = branch.builds;

        if (branch.builds && branch.builds.models.length) {
          const lastBuild = branch.builds.models[builds.models.length - 1];

          branch.attrs.last_build = lastBuild.attrs;

          if (lastBuild.commit) {
            // FIXME there should be a hasOne relationship here but I couldn’t get that working…
            const commit = lastBuild.commit.models[0];
            branch.attrs.last_build.commit = commit;

            if (commit && commit.committer) {
              // FIXME this is obviously OUT OF CONTROL
              branch.attrs.last_build.commit.attrs.committer = commit.committer.attrs;
            }
          }
        }

        return branch.attrs;
      }),
      pagination: {
        count: object.length
      }
    };
  }
});
