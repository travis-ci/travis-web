import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  buildUrl(modelName, id, snapshot, requestType, query) {
    var url = this._super(...arguments);

    return url;
  },

  ajaxOptions(url, type, options) {
    var hash = options || {};
    if(!hash.data) {
      hash.data = {};
    }

    if(hash.data.include) {
      hash.data.include += ',repository.last_build,build.commit';
    } else {
      hash.data.include = 'repository.last_build,build.commit';
    }

    return this._super(url, type, hash);
  }
});
