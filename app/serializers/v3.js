import { underscore } from '@ember/string';
import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { isNone, typeOf } from '@ember/utils';
import JSONSerializer from 'ember-data/serializers/json';
import wrapWithArray from 'travis/utils/wrap-with-array';
import traverse from 'travis/utils/traverse-payload';

// Currently the way we normalize payload is as follows:
//
// * we extract attributes using a default implementation of `extractAttributes`
//   from JSON serializer that we inherit from. It just grabs all of the defined
//   attributes from the payload.
//   * we also remove any @ attributes before getting them to the attributes
//   section
// * then we extract relationships:
//   * we go through each relationship and get the hash or an array of hashes in
//     case of a hasMany relationship
//   * JSON API accepts relationships in a following way:
//
//       {
//         relationships: {
//           build: {
//             data: { id: 1, type: 'build' }
//           },
//           jobs: {
//             data: [
//               { id: 1, type: 'job' },
//               { id: 2, type: 'job' }
//             ]
//           }
//         }
//       }
//   * during a first pass we save relationships as a full record, so instead of
//     passing just id and type, we also pass attributes, relationships etc. We
//     also save hasMany relationships a little bit differently, so after
//     running through `extractRelationships` a record could look like this:
//
//       {
//         relationships: {
//           build: {
//             data: {
//               id: 1,
//               type: 'build',
//               attributes: {
//                 number: '1',
//                 state: 'passed'
//               },
//               relationships: {}
//             },
//             included: [],
//             meta: {
//               representation: 'standard'
//             }
//           },
//           jobs: [
//             {
//               data: {
//                 id: 1,
//                 type: 'job',
//                 attributes: {
//                   number: '1.1',
//                   state: 'passed'
//                 },
//                 relationships: {},
//               },
//               included: [],
//               meta: {
//                 representation: 'standard'
//               }
//             }
//           ]
//         }
//       }
//
//   * note a few things here:
//     * records inside relationships may also have their own related records,
//       so we end up with a tree of nested records
//     * records also have `included` array, which during normalization will be
//       copied to the top most record
//     * records also have a meta section that keeps any information that we may
//       need later (in this case we keep representation to know which records
//       we should load into the store and which should just be left as
//       relationship info)
//     * hasMany relationship structure differs (it's an array of JSON API
//       records instead of just `data: []`)
//   * after relationships are extracted this way it will be easier to further
//     process them in `normalize`
//   * in `normalize` we loop through each relationship and put any related
//     records with a `standard` representation to the `included` array. This
//     ensures that they're loaded into the store
//     * we ommit other representations, because we don't have any mechanism to
//       load missing data
//     * while looping through relationships we also fix relationships to look
//       like JSON API's relationships: we leave only id and type and for
//       hasMany relationships we also change the structure
export default JSONSerializer.extend({

  extractRelationships(modelClass, resourceHash) {
    let relationships = {};

    modelClass.eachRelationship((key, relationshipMeta) => {
      let relationship = null;
      let relationshipKey = this.keyForRelationship(key, relationshipMeta.kind, 'deserialize');
      let relationshipHash = resourceHash[relationshipKey];

      if (relationshipHash) {
        let data = null;
        if (relationshipMeta.kind === 'belongsTo') {
          if (relationshipMeta.options.polymorphic) {
            // extracting a polymorphic belongsTo may need more information
            // than the type and the hash (which might only be an id) for the
            // relationship, hence we pass the key, resource and
            // relationshipMeta too
            let options = {
              key: key,
              resourceHash: resourceHash,
              relationshipMeta: relationshipMeta
            };
            data = this.extractPolymorphicRelationship(relationshipMeta.type,
              relationshipHash,
              options);
          } else {
            data = this.extractRelationship(relationshipMeta.type, relationshipHash);
          }
        } else if (relationshipMeta.kind === 'hasMany') {
          if (!isNone(relationshipHash)) {
            data = new Array(relationshipHash.length);
            for (let i = 0, l = relationshipHash.length; i < l; i++) {
              let item = relationshipHash[i];
              data[i] = this.extractRelationship(relationshipMeta.type, item);
            }
          }
        }
        relationship = data;
      }

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
    } else if (key) {
      return underscore(key);
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

    let meta = this.extractMeta(store, primaryModelClass, payload) || {},
      pagination = payload['@pagination'];

    if (pagination) {
      meta.pagination = pagination;
    }

    let metaType = typeOf(meta);
    let metaIsObject = metaType == 'object';
    let errorMessage =
      `The 'meta' returned from 'extractMeta' has to be an object, not ${metaType}.`;
    assert(errorMessage, metaIsObject);
    documentHash.meta = meta;

    let items;
    let type = payload['@type'];
    if (type) {
      items = payload[type];
    } else {
      const plural = `${underscore(primaryModelClass.modelName)}s`;
      items = payload[plural];
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
    let { data, meta, included } = this._super(...arguments);

    if (!resourceHash['@type']) {
      return { data, included, meta };
    }

    meta     = meta || {};
    included = included || [];

    if (!meta['representation']) {
      meta.representation = resourceHash['@representation'];
    }

    // if we have relationship data, attempt to include those as sideloaded
    // records by adding them to the included array.
    // We must have both relationships *and* included specified for this to
    // work.
    if (data.relationships) {
      Object.keys(data.relationships).forEach((key) => {
        let relationship = data.relationships[key];
        let relationshipHashes = wrapWithArray(relationship);

        relationshipHashes.forEach((relationshipHash) => {
          let meta = relationshipHash.meta || {};
          let relationshipIncluded = relationshipHash.included || [];
          let relationshipType = relationshipHash.data?.type;

          if (meta.representation === 'standard' ||
              (meta.representation === 'minimal' && relationshipType === 'branch')) {
            included.push(relationshipHash.data);
          }

          relationshipIncluded.forEach(item => included.push(item));
        });

        if (isArray(relationship)) {
          data.relationships[key] = {
            data: relationship.map(({ data }) => {
              const { id, type } = data;
              return { id, type };
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

    return { data, included, meta };
  },

  keyForAttribute(key) {
    return underscore(key);
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
