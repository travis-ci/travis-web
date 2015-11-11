import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  isNewSerializerAPI: true,

  extractRelationship(type, hash) {
    let relationshipHash = this._super(...arguments);
    if(relationshipHash && relationshipHash['@type']) {
      relationshipHash.type = relationshipHash['@type'];
    } else if(relationshipHash && !relationshipHash.type) {
      relationshipHash.type = type;
    }
    return relationshipHash;
  },

  extractRelationships() {
    let relationships = this._super(...arguments);
    return relationships;
  },

  keyForRelationship(key, typeClass, method) {
    if(key && key.underscore) {
      return key.underscore();
    } else {
      return key;
    }
  },

  extractAttributes() {
    let attributes = this._super(...arguments);
    for(let key in attributes) {
      if(key.startsWith('@')) {
        delete attributes.key;
      }
    }

    return attributes;
  },

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    let documentHash = {
      data: null,
      included: []
    };

    let meta = this.extractMeta(store, primaryModelClass, payload);
    if (meta) {
      Ember.assert('The `meta` returned from `extractMeta` has to be an object, not "' + Ember.typeOf(meta) + '".', Ember.typeOf(meta) === 'object');
      documentHash.meta = meta;
    }

    let items, type;
    if(type = payload['@type']) {
      items = payload[type];
    } else {
      items = payload[primaryModelClass.modelName.underscore() + 's'];
    }

    documentHash.data = items.map((item) => {
      let { data, included } = this.normalize(primaryModelClass, item);
      if (included) {
        documentHash.included.push(...included);
      }
      return data;
    });

    return documentHash;
  },

  normalize(modelClass, resourceHash) {
    let { data, included } = this._super(...arguments);
    if(!included) {
      included = [];
    }
    let store = this.store;

    if(data.relationships) {
      Object.keys(data.relationships).forEach(function (key) {
        let relationship = data.relationships[key];
        let process = function(data) {
          if(data['@representation'] !== 'standard') {
            return;
          }
          let type = data['@type'];
          let serializer = store.serializerFor(type);
          let modelClass = store.modelFor(type);
          let normalized = serializer.normalize(modelClass, data);
          included.push(normalized.data);
          if(normalized.included) {
            normalized.included.forEach(function(item) {
              included.push(item);
            });
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
  },

  keyForAttribute(key, method) {
    if(method === 'deserialize') {
      return Ember.String.underscore(key);
    } else {
      return Ember.String.camelize(key);
    }
  }
});
