import Ember from 'ember';
import { JSONAPISerializer } from 'ember-cli-mirage';
import { singularize, pluralize } from 'ember-inflector';
import apiSpec from '../api-spec';

export default JSONAPISerializer.extend({
  serialize(data, request) {
    let result;

    if (!request._processedRecords) {
      request._processedRecords = [];
    }

    if (data.models) {
      result = this.serializeCollection(data, request, { topLevel: true });
    } else {
      result = this.serializeSingle(data, request, { topLevel: true });
    }

    return result;
  },

  serializeCollection(data, request, options) {
    const type = pluralize(data.modelName),
      pagination = {
        count: data.models.length
      };

    return {
      '@href': this.hrefForCollection(type, data, request),
      '@representation': 'standard',
      '@type': type,
      '@pagination': pagination,
      [type]: data.models.map(model => this.serializeSingle(model, request, options)),
    };
  },

  serializeSingle(model, request, options = {}) {
    const type = model.modelName;
    const representation = this.representation(model, request, options);

    if (this.alreadyProcessed(model, request)) {
      return {
        '@href': this.hrefForSingle(type, model, request)
      };
    } else if (representation === 'standard') {
      request._processedRecords.push(model);
    }

    const result = {
      '@href': this.hrefForSingle(type, model, request),
      '@representation': representation,
      '@type': type,
    };

    let permissions = model.attrs.permissions;
    if (permissions) {
      delete model.attrs.permissions;

      result['@permissions'] = permissions;
    }

    this.getAttributes(type, representation, request).forEach((attributeName) => {
      let relationship = model[Ember.String.camelize(attributeName)];

      if (attributeName === 'id') {
        result['id'] = this.normalizeId(model, model.attrs.id);
      } else if (relationship && relationship.modelName) {
        // we're dealing with relationship
        let relationType = singularize(relationship.modelName),
          serializer = this.serializerFor(relationType);

        let serializeOptions = {};

        if (this.isIncluded(type, attributeName, request)) {
          serializeOptions.representation = 'standard';
        }

        if (relationship.attrs) {
          // belongsTo
          let serialized = serializer.serializeSingle(relationship, request, serializeOptions);
          result[attributeName] = serialized;
        } else {
          // hasMany
          result[attributeName] = relationship.models.map(
            m => serializer.serializeSingle(m, request, serializeOptions)
          );
        }
      } else {
        result[attributeName] = model.attrs[attributeName];
      }
    });

    return result;
  },

  getAttributes(type, representation, request) {
    let attributes = apiSpec.resources[type].representations[representation],
      include = request.queryParams.include;

    if (include) {
      include.split(',').forEach((includeSegment) => {
        let [includeType, includeAttribute] = includeSegment.split('.');
        if (includeType === type && !attributes.includes(includeAttribute)) {
          attributes.push(includeAttribute);
        }
      });
    }

    return attributes;
  },

  isIncluded(type, key, request) {
    let include = request.queryParams.include;

    if (include) {
      return !!include
        .split(',').map(s => s.split('.'))
        .filter(([includeType, includeAttribute]) => {
          return includeType === type && includeAttribute === key;
        })
        .length;
    }
  },

  includeAttribute(key, type, representation) {
    return this.getAttributes(key, type, representation).includes(key);
  },

  relationships() {
    return [];
  },

  serializerFor(type) {
    const serializersMap = {
      'commit': 'commit-v3',
      'user': 'user-v3',
    };
    type = serializersMap[type] || type;

    return this.registry.serializerFor(type);
  },

  hrefForCollection(type/* , collection, request */) {
    return `/${type}`;
  },

  hrefForSingle(type, model) {
    return `/${type}/${model.id}`;
  },

  alreadyProcessed(model, request) {
    let findFn = r => r.id === model.id && r.modelName === model.modelName;
    return request._processedRecords.find(findFn);
  },

  normalizeId(_model, id) {
    return id;
  },

  representation(model, request, options) {
    if (options.representation) {
      return options.representation;
    } else if (options.topLevel) {
      return 'standard';
    } else {
      return 'minimal';
    }
  }
});
