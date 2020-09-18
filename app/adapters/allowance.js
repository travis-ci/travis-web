import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  buildURL: function (modelName, id, snapshot, requestType, query) {
    const prefix = this.urlPrefix();
    const { login, provider } = query;
    const providerPrefix = provider ? `${provider}/` : '';
    delete query.login;
    delete query.provider;
    return `${prefix}/owner/${providerPrefix}${login}/allowance`;
  },
});
