import V3Serializer from 'travis/serializers/v3';
import { underscore } from '@ember/string';
import { isNone } from '@ember/utils';

export default V3Serializer.extend({
  attrs: {
    permissions: { key: '@permissions' }
  },

  serialize(snapshot, options) {
    const json = this._super(...arguments);
    if (options && options.update) {
      return Object.keys(json).reduce((updatedJson, attribute) => {
        const splitAttribute = attribute.split('.');
        const leftAttribute = splitAttribute[0];
        const rightAttribute = splitAttribute[1];
        if (leftAttribute === 'billing_info') {
          updatedJson[rightAttribute] = json[`billing_info.${rightAttribute}`];
        }
        return updatedJson;
      }, {});
    }
    return json;
  },

  serializeBelongsTo(snapshot, json, relationship) {
    let key = relationship.key;
    let belongsTo = snapshot.belongsTo(key);
    const planId = snapshot.belongsTo('plan', { id: true });

    key = this.keyForRelationship ? this.keyForRelationship(key, 'belongsTo', 'serialize') : key;

    if (isNone(belongsTo)) {
      json[key] = null;
    } else if (key === 'plan') {
      json['plan'] = planId;
    } else {
      belongsTo.eachAttribute(name => {
        json[`${key}.${underscore(name)}`] = belongsTo.attr(name);
      });
    }
  },

  normalizeArrayResponse(store, primaryModelClass, payload) {
    let documentHash = this._super(...arguments);

    (payload['@permissions'] || []).forEach(permissionsObject => {
      documentHash.included.push({
        type: permissionsObject.owner['type'],
        id: permissionsObject.owner.id,
        attributes: {
          subscriptionPermissions: {
            create: permissionsObject.create
          }
        }
      });
    });

    return documentHash;
  }
});
