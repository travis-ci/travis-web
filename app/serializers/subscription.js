import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  normalizeArrayResponse(store, primaryModelClass, payload) {
    let documentHash = this._super(...arguments);

    (payload.permissions || []).forEach(permissionsObject => {
      documentHash.included.push({
        type: permissionsObject.owner['@type'],
        id: permissionsObject.owner.id,
        attributes: {
          subscriptionPermissions: permissionsObject['@permissions']
        }
      });
    });

    return documentHash;
  }
});
