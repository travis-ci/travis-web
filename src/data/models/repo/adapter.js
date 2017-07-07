import V3Adapter from "travis/src/data/models/v3/adapter";

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  includes: 'build.branch,repository.default_branch,repository.current_build,build.commit'
});
