import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  includes: 'build.branch,repository.default_branch,repository.current_build,build.commit',

  ajaxOptions(url, type, options) {
    const hash = options || {};
    if (!hash.data) {
      hash.data = {};
    }

    if (hash.data.include) {
      hash.data.include += `,${this.get('includes')}`;
    } else {
      hash.data.include = this.get('includes');
    }

    return this._super(url, type, hash);
  }
});
