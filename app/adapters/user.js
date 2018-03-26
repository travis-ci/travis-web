import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  urlForQueryRecord: function (query) {
    if (query.current) {
      return '/user';
    } else {
      return this._super(...arguments);
    }
  },
});
