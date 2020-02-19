import { JSONAPISerializer } from 'ember-cli-mirage';
import { singularize, pluralize } from 'ember-inflector';
import { camelize } from '@ember/string';
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
    let type = pluralize(data.modelName),
      pagination;

    if (!request.noPagination) {
      let count = data.models.length,
        offset = request.queryParams.offset || 0,
        limit = request.queryParams.limit || 10,
        isFirst = false,
        isLast = offset + limit >= count,
        next, prev;

      if (offset == 0) {
        isFirst = true;
      }

      if (!isLast) {
        next = {
          offset: offset + limit,
          limit: limit
        };
      }

      if (!isFirst) {
        let prevOffset = offset - limit;
        prev = {
          offset: prevOffset < 0 ? 0 : prevOffset,
          limit: limit
        };
      }

      pagination = {
        count: count,
        offset: offset,
        limit: limit,
        is_first: isFirst,
        is_last: isLast,
        next,
        prev
      };

      if (offset) {
        data = data.slice(offset);
      }

      if (limit) {
        data = data.slice(0, limit);
      }
    }

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
      let relationship = model[camelize(attributeName)];

      if (attributeName === 'id') {
        result['id'] = this.normalizeId(model, model.attrs.id);
      } else if (relationship && relationship.modelName) {
        // we're dealing with relationship
        let relationType = singularize(relationship.modelName);
        let serializer = this.serializerFor(relationType);

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
    let resource = apiSpec.resources[type];

    if (!resource) {
      throw new Error(`Unable to find API spec for resource ${type}`);
    }

    let attributes = resource.representations[representation],
      include = request.queryParams.include;

    if (include) {
      include.split(',').forEach((includeSegment) => {
        let [includeType, includeAttribute] = includeSegment.split('.');
        let includeTypeIsThis = (includeType === type) ||
          (includeType === 'owner' && (type === 'user' || type === 'organization'));

        if (includeTypeIsThis && !attributes.includes(includeAttribute)) {
          attributes.push(includeAttribute);
        }
      });
    }

    return attributes;
  },

  isIncluded(type, key, request) {
    let include = request.queryParams.include;
    let ownerAliases = ['user', 'organization'];
    let subscriptionInclusions = ['billing_info', 'credit_card_info', 'discount', 'plan'];

    if (ownerAliases.includes(type)) {
      type = 'owner';
    }

    if (include) {
      return !!include
        .split(',').map(s => s.split('.'))
        .filter(([includeType, includeAttribute]) => {
          return includeType === type && includeAttribute === key;
        })
        .length;
    } else if (type === 'subscription' && subscriptionInclusions.includes(key)) {
      // The true API always returns these as standard representations.
      return true;
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

  normalizeId({modelName}, id) {
    // plan IDs can be strings
    if (modelName === 'plan') {
      return id;
    } else {
      return parseInt(id);
    }
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
