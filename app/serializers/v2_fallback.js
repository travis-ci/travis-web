import Ember from 'ember';
import V3Serializer from 'travis/serializers/v3';
import wrapWithArray from 'travis/utils/wrap-with-array';

export default V3Serializer.extend({

  extractRelationships(modelClass, resourceHash) {
    if (resourceHash['@type']) {
      return this._super(...arguments);
    } else {
      let relationships = {};

      modelClass.eachRelationship((key, relationshipMeta) => {
        // V2 API payload
        let relationship = null;
        let relationshipKey = this.keyForV2Relationship(key, relationshipMeta.kind, 'deserialize');
        let alternativeRelationshipKey = key.underscore();
        let hashWithAltRelKey = resourceHash[alternativeRelationshipKey];
        let hashWithRelKey = resourceHash[relationshipKey];

        if (hashWithAltRelKey || hashWithRelKey) {
          let data = null;
          let relationshipHash = resourceHash[alternativeRelationshipKey] ||
            resourceHash[relationshipKey];
          if (relationshipMeta.kind === 'belongsTo') {
            data = this.extractRelationship(relationshipMeta.type, relationshipHash);
          } else if (relationshipMeta.kind === 'hasMany') {
            data = relationshipHash.map((item) => {
              return this.extractRelationship(relationshipMeta.type, item);
            });
          }
          relationship = data;
        }

        if (relationship) {
          relationships[key] = relationship;
        }
      });

      return relationships;
    }
  },

  normalize(modelClass, resourceHash) {
    if (resourceHash['@type']) {
      return this._super(...arguments);
    } else {
      var modelKey = modelClass.modelName;
      var attributes = resourceHash[modelKey];
      if (attributes) {
        for (var key in attributes) {
          resourceHash[key] = attributes[key];
        }

        resourceHash['type'] = modelKey;
        delete resourceHash[modelKey];
      }

      let { data, included } = this._super(...arguments);
      if (!included) {
        included = [];
      }

      if (data.relationships) {
        Object.keys(data.relationships).forEach((key) => {
          let relationship = data.relationships[key];
          let relationshipHashes = wrapWithArray(relationship);

          relationshipHashes.forEach((relationshipHash) => {
            let relationshipIncluded = relationshipHash.included || [];

            if (Object.keys(relationshipHash.data.attributes || {}).length === 0) {
              return;
            }

            included.push(relationshipHash.data);
            relationshipIncluded.forEach(function (item) {
              included.push(item);
            });
          });

          if (Ember.isArray(relationship)) {
            data.relationships[key] = {
              data: relationship.map(({ data }) => {
                return { id: data.id, type: data.type };
              })
            };
          } else {
            data.relationships[key] = {
              data: {
                id: relationship.data.id, type: relationship.data.type
              }
            };
          }
        });
      }

      return { data, included };
    }
  },

  keyForV2Relationship(key/* , typeClass, method*/) {
    if (key === 'repo') {
      return 'repository';
    } else {
      return key.underscore() + '_id';
    }
  }
});
