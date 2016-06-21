import Serializer from 'ember-cli-mirage/serializer';

import { hasMany, belongsTo } from 'ember-cli-mirage';

import Ember from 'ember';

export default Serializer.extend({
  serialize(response, request) {
    if (this.isModel(response)) {
      // FIXME is there a way to call Serializer.serialize without this.super?
      let result = this._serializeModel(response, request);

      if (this._requestIsForV3(request)) {
        result['@type'] = response.modelName;
        return result;
      } else {
        const wrappedResult = {};
        wrappedResult[response.modelName] = result;
        return wrappedResult;
      }
    } else {
      const results = response.models.map(model => this._serializeModel(model, request));
      const pluralType = Ember.String.pluralize(response.modelName);
      const result = {
        '@type': pluralType,
        '@pagination': {
          count: response.models.length
        }
      };

      result[pluralType] = results;
      return result;
    }
  },

  _requestIsForV3(request) {
    if (!request) {
      return false;
    }

    return this._requestHasV3Header(request) || this._requestHasV3Path(request);
  },

  _requestHasV3Header(request) {
    return request.requestHeaders && request.requestHeaders['Travis-API-Version'] === '3';
  },

  _requestHasV3Path(request) {
    return request.url && request.url.indexOf('/v3') === 0;
  }
});
