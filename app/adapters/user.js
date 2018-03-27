import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  // FIXME is this approprate???
  buildURL: function () {
    const prefix = this.urlPrefix();
    return `${prefix}/user`;
  },
});
