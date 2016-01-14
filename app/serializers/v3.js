import Ember from 'ember';
import JSONSerializer from 'ember-data/serializers/json';

var traverse = function(object, callback) {
  if(!object) {
    return;
  }

  if(typeof(object) === 'object' && !Ember.isArray(object)) {
    callback(object);
  }

  if(Ember.isArray(object)) {
    for(let item of object) {
      traverse(item, callback);
    }
  } else if(typeof object === 'object') {
    for(let key in object) {
      if(object.hasOwnProperty(key)) {
        let item = object[key];
        traverse(item, callback);
      }
    }
  }
};

export default JSONSerializer.extend({
  isNewSerializerAPI: true,

  extractRelationship(type, hash) {
    if(hash && !hash.id && hash['@href']) {
      hash.id = hash['@href'];
    }

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

  extractAttributes(modelClass, resourceHash) {
    let attributes = this._super(...arguments);
    for(let key in attributes) {
      if(key.startsWith('@')) {
        delete attributes.key;
      }
    }

    return attributes;
  },

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    this._fixReferences(payload);
    return this._super(...arguments);
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

  keyForAttribute(key) {
    return Ember.String.underscore(key);
  },

  _fixReferences(payload) {
    let byHref = {}, href, records;
    if(payload['@type']) {
      // API V3 doesn't return all of the objects in a full representation
      // If an object is present in one place in the response, all of the
      // other occurences will be just references of a kind - they will just
      // include @href property.
      //
      // I don't want to identify records by href in ember-data, so here I'll
      // set an id and a @type field on all of the references.
      //
      // First we need to group all of the items in the response by href:
      traverse(payload, (item) => {
        if(href = item['@href']) {
          if(records = byHref[href]) {
            records.push(item);
          } else {
            byHref[href] = [item];
          }
        }
      });

      // Then we can choose a record with an id for each href and put the id
      // in all of the other occurences.
      for(let href in byHref) {
        records = byHref[href];
        let recordWithAnId = records.find( (record) => record.id );
        if(recordWithAnId) {
          for(let record of records) {
            record.id = recordWithAnId.id;
            //record['@type'] = recordWithAnId['@type'];
          }
        }
      }
    }

    return payload;
  }
});
