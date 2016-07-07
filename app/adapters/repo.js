import V3Adapter from 'travis/adapters/v3';
import Config from 'travis/config/environment';

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  ajaxOptions(url, type, options) {
    var hash = options || {};
    if(!hash.data) {
      hash.data = {};
    }

    if(hash.data.include) {
      hash.data.include += ',build.branch,repository.default_branch,repository.current_build,build.commit';
    } else {
      hash.data.include = 'build.branch,repository.default_branch,repository.current_build,build.commit';
    }

    return this._super(url, type, hash);
  }
});
