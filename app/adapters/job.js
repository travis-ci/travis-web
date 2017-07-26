import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  query(store, type, query) {
    if (query.owner && query.runningOnly) {
      const owner = query.owner;
      delete query.owner;
      const runningOnly = query.runningOnly;
      delete query.runningOnly;

      //const url = `${this.urlPrefix()}/owner/${owner}/active`;
      const url = `${this.urlPrefix()}/owner/travis-ci/active`;
      return this.ajax(url, 'GET', query);
    } else {
      this._super(...arguments);
    }
  }
});
