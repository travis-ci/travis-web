import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  query(store, type, query) {
    const provider = query['provider'];
    const login = query['login'];
    delete query['provider'];
    delete query['login'];
    const url = `${this.urlPrefix()}/owner/${provider}/${login}/custom_images`;
    return this.ajax(url, 'GET', query);
  }
});
