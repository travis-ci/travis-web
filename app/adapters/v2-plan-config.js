import V3Adapter from 'travis/adapters/v3';
import { assert } from '@ember/debug';

export default V3Adapter.extend({
  buildURL: function (modelName, id, snapshot, requestType, query) {
    const { type, orgId } = query;
    const isOrganization = type === 'organization';
    const isUser = type === 'user';

    assert('The plan config adapter only supports a query request type', requestType === 'query');
    assert('Invalid request parameters for plan config adapter', isUser || isOrganization && !!orgId);

    const path = isOrganization ? `v2_plans_for/organization/${orgId}` : 'v2_plans_for/user';
    return `${this.urlPrefix()}/${path}`;
  },

  // This overrides the parent implementation to ignore the query parameters
  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);
    return this.ajax(url, 'GET');
  }
});
