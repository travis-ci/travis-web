import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  includes: 'build.commit,build.branch'
});
