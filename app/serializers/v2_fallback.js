import Ember from 'ember';
import V3Serializer from 'travis/serializers/v3';

export default V3Serializer.extend({
  isNewSerializerAPI: true,

  extractRelationships(modelClass, resourceHash) {
    if(resourceHash['@type']) {
      return this._super(...arguments);
    } else {
      let relationships = {};

      modelClass.eachRelationship((key, relationshipMeta) => {
        // V2 API payload
        let relationship = null;
        let relationshipKey = this.keyForV2Relationship(key, relationshipMeta.kind, 'deserialize');
        let alternativeRelationshipKey = key.underscore();

        if (resourceHash.hasOwnProperty(alternativeRelationshipKey) || resourceHash.hasOwnProperty(relationshipKey)) {
          let data = null;
          let relationshipHash = resourceHash[alternativeRelationshipKey] || resourceHash[relationshipKey];
          if (relationshipMeta.kind === 'belongsTo') {
            data = this.extractRelationship(relationshipMeta.type, relationshipHash);
          } else if (relationshipMeta.kind === 'hasMany') {
            data = relationshipHash.map((item) => this.extractRelationship(relationshipMeta.type, item));
          }
          relationship = { data };
        }

        if (relationship) {
          relationships[key] = relationship;
        }
      });

      return relationships;
    }
  },

  normalize(modelClass, resourceHash) {
    if(resourceHash['@type']) {
      return this._super(...arguments);
    } else {
      var modelKey = modelClass.modelName;
      var attributes = resourceHash[modelKey];
      if(attributes) {
        for(var key in attributes) {
          resourceHash[key] = attributes[key];
        }

        resourceHash['type'] = modelKey;
        delete resourceHash[modelKey];
      }

      let { data, included } = this._super(...arguments);
      if(!included) {
        included = [];
      }
      let store = this.store;

      if(data.relationships) {
        Object.keys(data.relationships).forEach(function (key) {
          let relationship = data.relationships[key];
          let process = function(data) {
            if(Object.keys(data).sort()+'' !== 'id,type' || (data['@href'] && data.type === 'branch')) {
              // no need to add records if they have only id and type
              let type = key === 'defaultBranch' ? 'branch' : key.singularize();
              let serializer = store.serializerFor(type);
              let modelClass = store.modelFor(type);
              let normalized = serializer.normalize(modelClass, data);
              included.push(normalized.data);
              if(normalized.included) {
                normalized.included.forEach(function(item) {
                  included.push(item);
                });
              }
            }
          };

          if(Array.isArray(relationship.data)) {
            relationship.data.forEach(process);
          } else if(relationship && relationship.data) {
            process(relationship.data);
          }
        });
      }

      return { data, included };
    }
  },

  keyForV2Relationship(key, typeClass, method) {
    return key.underscore() + '_id';
  }
});
