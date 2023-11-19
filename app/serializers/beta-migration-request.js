import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  normalize(modelClass, payload = {}) {
    if (payload.organizations) {
      payload['organization_ids'] = payload.organizations;
    }
    return this._super(...arguments);
  }

});
