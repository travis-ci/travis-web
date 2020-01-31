import V3Adapter from 'travis/adapters/v3';

export default V3Adapter.extend({
  defaultSerializer: '-repo',

  includes: [
    'build.branch',
    'build.commit',
    'build.created_by',
    'build.request',
    'repository.current_build',
    'repository.default_branch',
    'repository.email_subscribed',
    'owner.github_id',
    'owner.installation',
  ].join(','),

  buildURL(modelName, id, snapshot, requestType, query) {
    const prefix = this.urlPrefix();

    if (query) {
      const { provider, slug, custom } = query;
      const providerPrefix = provider ? `${provider}/` : '';

      delete query.provider;
      delete query.slug;
      delete query.custom;

      // fetch repo by slug
      if (!id && slug) {
        return `${prefix}/repo/${providerPrefix}${encodeURIComponent(slug)}`;
      }

      if (custom && custom.type === 'byOwner') {
        const { owner } = custom;
        return `${prefix}/owner/${providerPrefix}${owner}/repos`;
      }
    }
    return this._super(modelName, id, snapshot, requestType, query);
  },

  activate(id) {
    const prefix = this.urlPrefix();
    const url = `${prefix}/repo/${id}/activate`;
    return this.ajax(url, 'POST');
  },

  deactivate(id) {
    const prefix = this.urlPrefix();
    const url = `${prefix}/repo/${id}/deactivate`;
    return this.ajax(url, 'POST');
  },
});
