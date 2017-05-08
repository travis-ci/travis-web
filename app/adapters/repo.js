import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  includes: 'build.branch,repository.default_branch'
    + ',repository.current_build,build.commit,build.stages'
});
