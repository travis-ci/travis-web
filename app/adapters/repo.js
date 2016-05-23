import V3Adapter from 'travis/adapters/v3';
import ApplicationAdapter from 'travis/adapters/application';
import Config from 'travis/config/environment';

let Adapter = Config.useV3API ? V3Adapter : ApplicationAdapter;

export default Adapter.extend({
  defaultSerializer: '-repo',

  ajaxOptions(url, type, options) {
    var hash = options || {};
    if(!hash.data) {
      hash.data = {};
    }

    if(Config.useV3API) {
      if(hash.data.include) {
        hash.data.include += ',repository.default_branch,branch.last_build,build.commit';
      } else {
        hash.data.include = 'repository.default_branch,branch.last_build,build.commit';
      }
    }

    return this._super(url, type, hash);
  }
});
