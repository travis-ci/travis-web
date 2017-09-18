import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  ajaxOptions: function (url, type, options) {
    let hash = this._super(...arguments);

    if (options.data.useCache) {
      delete options.data.useCache;
      options.headers['x-use-cache'] = true;
    }

    return hash;
  },

  includes: 'build.branch,repository.default_branch'
    + ',repository.current_build,build.commit'
});
