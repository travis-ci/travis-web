import Ember from 'ember';
import JSONSerializer from 'ember-data/serializers/json';
import wrapWithArray from 'travis/utils/wrap-with-array';

var traverse = function (object, callback) {
  if (!object) {
    return;
  }

  if (typeof(object) === 'object' && !Ember.isArray(object)) {
    callback(object);
  }

  if (Ember.isArray(object)) {
    for (let item of object) {
      traverse(item, callback);
    }
  } else if (typeof object === 'object') {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        let item = object[key];
        traverse(item, callback);
      }
    }
  }
};

export default JSONSerializer.extend({

  extractRelationships(modelClass, resourceHash) {
    var relationships = {};

    modelClass.eachRelationship((key, relationshipMeta) => {
      var relationship = null;
      var relationshipKey = this.keyForRelationship(key, relationshipMeta.kind, 'deserialize');

      if (resourceHash[relationshipKey] !== undefined) {
        var data = null;
        var relationshipHash = resourceHash[relationshipKey];
        if (relationshipMeta.kind === 'belongsTo') {
          if (relationshipMeta.options.polymorphic) {
            // extracting a polymorphic belongsTo may need more information
            // than the type and the hash (which might only be an id) for the
            // relationship, hence we pass the key, resource and
            // relationshipMeta too
            data = this.extractPolymorphicRelationship(relationshipMeta.type, relationshipHash, { key: key, resourceHash: resourceHash, relationshipMeta: relationshipMeta });
          } else {
            data = this.extractRelationship(relationshipMeta.type, relationshipHash);
          }
        } else if (relationshipMeta.kind === 'hasMany') {
          if (!Ember.isNone(relationshipHash)) {
            data = new Array(relationshipHash.length);
            for (var i = 0, l = relationshipHash.length; i < l; i++) {
              var item = relationshipHash[i];
              data[i] = this.extractRelationship(relationshipMeta.type, item);
            }
          }
        }
        relationship = data;
      }

      //var linkKey = _this3.keyForLink(key, relationshipMeta.kind);
      //if (resourceHash.links && resourceHash.links[linkKey] !== undefined) {
      //  var related = resourceHash.links[linkKey];
      //  relationship = relationship || {};
      //  relationship.links = { related: related };
      //}

      if (relationship) {
        relationships[key] = relationship;
      }
    });

    return relationships;
  },

  extractRelationship(type, hash) {
    if (hash && !hash.id && hash['@href']) {
      hash.id = hash['@href'];
    }

    let relationshipHash = this._super(...arguments);
    if (relationshipHash && relationshipHash['@type']) {
      relationshipHash.type = this.getType(relationshipHash['@type']);
    } else if (relationshipHash && !relationshipHash.type) {
      relationshipHash.type = type;
    }

    let modelClass = this.store.modelFor(relationshipHash.type);
    let serializer = this.store.serializerFor(relationshipHash.type);
    return serializer.normalize(modelClass, relationshipHash);
  },

  keyForRelationship(key/* , typeClass, method*/) {
    if (key === 'repo') {
      return 'repository';
    } else if (key && key.underscore) {
      return key.underscore();
    } else {
      return key;
    }
  },

  extractAttributes(/* modelClass,resourceHash*/) {
    let attributes = this._super(...arguments);
    for (let key in attributes) {
      if (key.startsWith('@')) {
        delete attributes.key;
      }
    }

    return attributes;
  },

  normalizeResponse(store, primaryModelClass, payload/* , id, requestType*/) {
    this._fixReferences(payload);
    return this._super(...arguments);
  },

  normalizeArrayResponse(store, primaryModelClass, payload/* , id, requestType*/) {
    let documentHash = {
      data: null,
      included: []
    };

    let meta = this.extractMeta(store, primaryModelClass, payload);
    if (meta) {
      let metaType = Ember.typeOf(meta);
      let metaIsObject = metaType == 'object';
      let errorMessage =
        `The 'meta' returned from 'extractMeta' has to be an object, not ${metaType}.`;
      Ember.assert(errorMessage, metaIsObject);
      documentHash.meta = meta;
    }

    let items;
    let type = payload['@type'];
    if (type) {
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
    let {data, meta, included} = this._super(...arguments),
      store = this.store;

    meta     = meta || {};
    included = included || []

    if (!meta['representation']) {
      meta.representation = resourceHash['@representation'];
    }

    // if we have relationship data, attempt to include those as sideloaded
    // records by adding them to the included array.
    // We must have both relationships *and* included specified for this to
    // work.
    if (data.relationships) {
      Object.keys(data.relationships).forEach((key) => {
        let relationshipHashes = wrapWithArray(data.relationships[key]);
        relationshipHashes.forEach((relationshipHash) => {
          let meta = relationshipHash.meta || {};
          let relationshipIncluded = relationshipHash.included || [];

          if (meta.representation !== 'standard') {
            return;
          }

          included.push(relationshipHash.data);
          relationshipIncluded.forEach(function (item) {
            included.push(item);
          });
        });
      });
    }

    return { data, included, meta };
  },

  keyForAttribute(key) {
    return Ember.String.underscore(key);
  },

  getType(type) {
    return type === 'repository' ? 'repo' : type;
  },

  _fixReferences(payload) {
    let byHref = {}, records;
    if (payload['@type']) {
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
        let href = item['@href'];
        if (href) {
          let records = byHref[href];
          if (records) {
            records.push(item);
          } else {
            byHref[href] = [item];
          }
        }
      });

      // Then we can choose a record with an id for each href and put the id
      // in all of the other occurences.
      for (let href in byHref) {
        records = byHref[href];
        let recordWithAnId = records.find((record) => record.id);
        if (recordWithAnId) {
          for (let record of records) {
            record.id = recordWithAnId.id;
            // record['@type'] = recordWithAnId['@type'];
          }
        }
      }
    }

    return payload;
  }
});
