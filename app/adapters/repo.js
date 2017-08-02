import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  includes: 'build.branch,repository.default_branch'
    + ',repository.current_build,build.commit',

  query(store, type, query) {
    const owner = query.owner;
    delete query.owner;
    const url = `${this.urlPrefix()}/owner/${owner}/repos`;
    return this.ajax(url, 'GET', query);
  }
});
